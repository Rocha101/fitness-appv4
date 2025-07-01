import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),

  // Activity endpoints
  createActivity: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        intensity: z.enum(["Baixa", "Média", "Alta"]),
        duration: z.string().min(1),
        emoji: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.create({
        data: {
          name: input.name,
          intensity: input.intensity,
          duration: input.duration,
          emoji: input.emoji,
          userId: ctx.session.user.id,
        },
      });
      return activity;
    }),

  updateActivity: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        intensity: z.enum(["Baixa", "Média", "Alta"]),
        duration: z.string().min(1),
        emoji: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id, // Ensure user can only update their own activities
        },
        data: {
          name: input.name,
          intensity: input.intensity,
          duration: input.duration,
          emoji: input.emoji,
        },
      });
      return activity;
    }),

  deleteActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id, // Ensure user can only delete their own activities
        },
      });
      return activity;
    }),

  getActivities: protectedProcedure.query(async ({ ctx }) => {
    const activities = await ctx.db.activity.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return activities;
  }),

  getActivityStats: protectedProcedure.query(async ({ ctx }) => {
    const totalActivities = await ctx.db.activity.count({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const recentActivities = await ctx.db.activity.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    return {
      totalActivities,
      recentActivities,
    };
  }),

  // Chat endpoints
  createChat: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50).optional().default("Novo Chat"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return chat;
    }),

  getChats: protectedProcedure.query(async ({ ctx }) => {
    const chats = await ctx.db.chat.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get only the last message for preview
        },
      },
    });
    return chats;
  }),

  getChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return chat;
    }),

  updateChatName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
      return chat;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string().min(1).max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create user message
      const userMessage = await ctx.db.message.create({
        data: {
          content: input.content,
          isUser: true,
          chatId: input.chatId,
        },
      });

      // Update chat's updatedAt
      await ctx.db.chat.update({
        where: {
          id: input.chatId,
          userId: ctx.session.user.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      // Get chat history for AI context
      const messages = await ctx.db.message.findMany({
        where: {
          chatId: input.chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 10, // Limit context to last 10 messages
      });

      // Prepare messages for AI
      const aiMessages = messages.map((msg) => ({
        role: (msg.isUser ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      }));

      try {
        // Generate AI response
        const result = await generateText({
          model: google("gemini-1.5-flash"),
          messages: [
            {
              role: "system",
              content:
                "Você é um assistente especializado em fitness e saúde. Responda sempre em português e de forma útil, motivadora e personalizada. Seja conciso mas informativo.",
            },
            ...aiMessages,
          ],
        });

        // Create AI message
        const aiMessage = await ctx.db.message.create({
          data: {
            content: result.text,
            isUser: false,
            chatId: input.chatId,
          },
        });

        return {
          userMessage,
          aiMessage,
        };
      } catch (error) {
        console.error("AI generation error:", error);

        // Create fallback AI message
        const aiMessage = await ctx.db.message.create({
          data: {
            content:
              "Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.",
            isUser: false,
            chatId: input.chatId,
          },
        });

        return {
          userMessage,
          aiMessage,
        };
      }
    }),

  deleteChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      return chat;
    }),
});
export type AppRouter = typeof appRouter;
