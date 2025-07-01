import "dotenv/config";
import { google } from "@ai-sdk/google";
import { trpcServer } from "@hono/trpc-server";
import {
  streamText,
  generateText,
  generateId,
  convertToCoreMessages,
} from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import prisma from "../prisma";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || [],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

// AI SDK Compatible Chat Routes
app.post("/api/chat", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));
    const { messages, id: chatId, authToken } = body;

    // Get session for authentication - Better Auth uses cookie-based sessions
    // For React Native, we need to validate the token directly from the database
    let session = null;
    let sessionToken = authToken;

    // Extract token from Bearer header if needed
    if (sessionToken && sessionToken.startsWith("Bearer ")) {
      sessionToken = sessionToken.substring(7);
    }

    console.log("Validating session token:", sessionToken);

    if (sessionToken) {
      try {
        // Query the session directly from the database
        const dbSession = await prisma.session.findUnique({
          where: {
            token: sessionToken,
          },
          include: {
            user: true,
          },
        });

        console.log("Database session found:", !!dbSession);

        if (dbSession && dbSession.expiresAt > new Date()) {
          // Session is valid and not expired
          session = {
            user: {
              id: dbSession.user.id,
              email: dbSession.user.email,
              name: dbSession.user.name,
            },
            session: {
              id: dbSession.id,
              userId: dbSession.userId,
              token: dbSession.token,
              expiresAt: dbSession.expiresAt,
            },
          };
          console.log("Valid session created for user:", session.user.email);
        } else if (dbSession) {
          console.log("Session expired:", dbSession.expiresAt);
        }
      } catch (error) {
        console.error("Database session validation error:", error);
      }
    }

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Ensure chat exists and belongs to user
    let chat;
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userId: session.user.id,
        },
      });
      if (!chat) {
        return c.json({ error: "Chat not found" }, 404);
      }
    } else {
      // Create new chat if no ID provided
      chat = await prisma.chat.create({
        data: {
          name: "Novo Chat",
          userId: session.user.id,
        },
      });
    }

    // Convert AI SDK messages to core messages
    const coreMessages = convertToCoreMessages(messages);

    const shouldStream = c.req.header("X-No-Stream") !== "true";

    // Use streaming when supported, otherwise fall back to a single JSON response

    if (!shouldStream) {
      const nonStreamResult = await generateText({
        model: google("gemini-1.5-flash"),
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especializado em fitness e saúde. Responda sempre em português e de forma útil, motivadora e personalizada. Seja conciso mas informativo.",
          },
          ...coreMessages,
        ],
      });

      // Save the user message & assistant reply
      const assistantMessageId = generateId();
      await prisma.message.createMany({
        data: [
          {
            id: messages[0]?.id || generateId(),
            content: messages[0]?.content ?? "", // user message
            isUser: true,
            chatId: chat.id,
            createdAt: new Date(),
          },
          {
            id: assistantMessageId,
            content: nonStreamResult.text,
            isUser: false,
            chatId: chat.id,
            createdAt: new Date(),
          },
        ],
      });

      await prisma.chat.update({
        where: { id: chat.id },
        data: { updatedAt: new Date() },
      });

      return c.json({
        message: {
          id: assistantMessageId,
          role: "assistant",
          content: nonStreamResult.text,
        },
        finishReason: nonStreamResult.finishReason,
      });
    }

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente especializado em fitness e saúde. Responda sempre em português e de forma útil, motivadora e personalizada. Seja conciso mas informativo.",
        },
        ...coreMessages,
      ],
      async onFinish({ response }) {
        // Save all messages to database
        const messagesToSave = [];

        // Save user messages first
        for (let i = 0; i < messages.length; i++) {
          const msg = messages[i];
          if (msg.role === "user") {
            messagesToSave.push({
              id: msg.id || generateId(),
              content: msg.content, // Store full content as JSON
              isUser: true,
              chatId: chat.id,
              createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
            });
          }
        }

        // Save AI response messages
        for (const responseMessage of response.messages) {
          if (responseMessage.role === "assistant") {
            messagesToSave.push({
              id: generateId(),
              content: responseMessage.content, // Store full content as JSON
              isUser: false,
              chatId: chat.id,
              createdAt: new Date(),
            });
          }
        }

        // Batch insert messages
        if (messagesToSave.length > 0) {
          await prisma.message.createMany({
            data: messagesToSave,
            skipDuplicates: true,
          });

          // Update chat's updatedAt
          await prisma.chat.update({
            where: { id: chat.id },
            data: { updatedAt: new Date() },
          });
        }
      },
    });

    console.log("Starting streaming response");

    return result.toDataStreamResponse({
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Load existing chat messages
app.get("/api/chat", async (c) => {
  try {
    const chatId = c.req.query("chatId");

    if (!chatId) {
      return c.json({ error: "Chat ID is required" }, 400);
    }

    // Get session for authentication using cookie or header
    const authToken = c.req.raw.headers.get("authorization");
    let session = null;
    let sessionToken = authToken;

    // Extract token from Bearer header if needed
    if (sessionToken && sessionToken.startsWith("Bearer ")) {
      sessionToken = sessionToken.substring(7);
    }

    // First try cookie-based auth (for web)
    try {
      session = await auth.api.getSession({ headers: c.req.raw.headers });
    } catch (error) {
      console.log("Cookie auth failed, trying token validation");
    }

    // If no session from cookies, try direct database validation (for React Native)
    if (!session && sessionToken) {
      try {
        const dbSession = await prisma.session.findUnique({
          where: {
            token: sessionToken,
          },
          include: {
            user: true,
          },
        });

        if (dbSession && dbSession.expiresAt > new Date()) {
          session = {
            user: {
              id: dbSession.user.id,
              email: dbSession.user.email,
              name: dbSession.user.name,
            },
            session: {
              id: dbSession.id,
              userId: dbSession.userId,
              token: dbSession.token,
              expiresAt: dbSession.expiresAt,
            },
          };
        }
      } catch (error) {
        console.error("Database session validation error:", error);
      }
    }

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Load chat with messages
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return c.json({ error: "Chat not found" }, 404);
    }

    // Convert to AI SDK message format
    const messages = chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.isUser ? "user" : "assistant",
      content: msg.content, // Content is stored as JSON
      createdAt: msg.createdAt,
    }));

    return c.json({ messages, chatId: chat.id, chatName: chat.name });
  } catch (error) {
    console.error("Load chat error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
