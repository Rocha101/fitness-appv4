import { Injectable } from "@nestjs/common";
import { google } from "@ai-sdk/google";
import {
  streamText,
  generateText,
  generateId,
  convertToCoreMessages,
} from "ai";
import { ChatService } from "../chat/chat.service";

@Injectable()
export class AiService {
  constructor(private chatService: ChatService) {}

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

    if (!shouldStream) {
      const result = await generateText({
        model: google("gemini-1.5-flash"),
        messages: [systemMessage, ...coreMessages],
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
      model: google("gemini-1.5-flash"),
      messages: [systemMessage, ...coreMessages],
      async onFinish({ response }) {
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

        const responseText = response.messages?.[0]?.content || "";
        await this.chatService.addMessage(chatId, userId, responseText, false);
      },
    });
  }
}
