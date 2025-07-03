import { Injectable } from "@nestjs/common";
import { google } from "@ai-sdk/google";
import {
  streamText,
  generateText,
  generateId,
  convertToCoreMessages,
} from "ai";
import { ChatService } from "../chat/chat.service";
import { ActivityService } from "../activity/activity.service";
import { z } from "zod";

@Injectable()
export class AiService {
  constructor(
    private chatService: ChatService,
    private activityService: ActivityService,
  ) {}

  async generateResponse(
    chatId: string,
    userId: string,
    messages: any[],
    shouldStream: boolean = true,
  ) {
    // Ensure chat exists and belongs to user
    await this.chatService.findOne(chatId, userId);

    const coreMessages = convertToCoreMessages(messages);
    const systemMessage = {
      role: "system" as const,
      content:
        "Você é um assistente especializado em fitness e saúde. Responda sempre em português e de forma útil, motivadora e personalizada. Seja conciso mas informativo.",
    };

    const tools = {
      list_activities: {
        description: "Lista as atividades recentes do usuário.",
        parameters: z
          .object({
            limit: z
              .number()
              .min(1)
              .max(50)
              .optional()
              .describe(
                "Quantidade máxima de atividades a serem retornadas (padrão 10)",
              ),
          })
          .strict(),
        execute: async ({ limit = 10 }: { limit?: number }) => {
          const activities = await this.activityService.findAll(userId);
          return activities.slice(0, limit).map((a) => ({
            id: a.id,
            name: a.name,
            intensity: a.intensity,
            duration: a.duration,
            emoji: a.emoji,
            createdAt: a.createdAt.toISOString(),
          }));
        },
      },
      activity_stats: {
        description:
          "Retorna estatísticas agregadas das atividades do usuário.",
        parameters: z.object({}).strict(),
        execute: async () => {
          return await this.activityService.getStats(userId);
        },
      },
    } as const;

    if (!shouldStream) {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        messages: [systemMessage, ...coreMessages],
        tools,
        maxSteps: 5,
      });

      // Save user message and AI response
      const userMessage = messages[messages.length - 1];
      if (userMessage) {
        await this.chatService.addMessage(
          chatId,
          userId,
          userMessage.content,
          true,
        );
      }

      const aiMessageId = generateId();
      await this.chatService.addMessage(chatId, userId, result.text, false);

      return {
        message: {
          id: aiMessageId,
          role: "assistant",
          content: result.text,
        },
        finishReason: result.finishReason,
      };
    }

    return streamText({
      model: google("gemini-2.5-flash"),
      messages: [systemMessage, ...coreMessages],
      tools,
      maxSteps: 5,
      async onFinish({ response, text }) {
        // Save user message and AI response
        const userMessage = messages[messages.length - 1];
        if (userMessage) {
          await this.chatService.addMessage(
            chatId,
            userId,
            userMessage.content,
            true,
          );
        }

        const responseText = text || response.messages?.[0]?.content || "";
        await this.chatService.addMessage(chatId, userId, responseText, false);
      },
    });
  }
}
