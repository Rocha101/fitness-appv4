import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Res,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";
import { Response } from "express";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

class ChatRequest {
  messages: any[];
  id?: string;
}

@ApiTags("AI Chat")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("chat")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  @ApiOperation({ summary: "Enviar mensagem para o assistente de IA" })
  @ApiHeader({
    name: "X-No-Stream",
    description: 'Se definido como "true", retorna resposta não-streaming',
    required: false,
  })
  @ApiResponse({ status: 200, description: "Resposta do assistente" })
  @ApiResponse({ status: 400, description: "Dados de entrada inválidos" })
  async chat(
    @Body() body: ChatRequest,
    @Headers("X-No-Stream") noStream: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const { messages, id: chatId } = body;
    const shouldStream = noStream !== "true";

    if (!chatId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "Chat ID is required",
      });
    }

    try {
      const result = await this.aiService.generateResponse(
        chatId,
        user.id,
        messages,
        shouldStream,
      );

      return res.json(result);
    } catch (error) {
      console.error("Chat error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Internal server error",
      });
    }
  }
}
