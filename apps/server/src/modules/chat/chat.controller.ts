import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { SendMessageDto } from "./dto/send-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "@prisma/client";
import { createChatSchema } from "./dto/create-chat.dto";
import { updateChatSchema } from "./dto/update-chat.dto";
import { ZodValidationPipe } from "@/lib/zod-validation.pipe";

@ApiTags("Chat")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("chats")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: "Criar novo chat" })
  @ApiResponse({ status: 201, description: "Chat criado com sucesso" })
  create(
    @Body(new ZodValidationPipe(createChatSchema))
    createChatDto: CreateChatDto,
    @CurrentUser() user: any,
  ) {
    return this.chatService.create(user.id, createChatDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os chats do usuário" })
  @ApiResponse({ status: 200, description: "Lista de chats" })
  findAll(@CurrentUser() user: any) {
    return this.chatService.findAll(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obter chat por ID" })
  @ApiResponse({ status: 200, description: "Chat encontrado" })
  @ApiResponse({ status: 404, description: "Chat não encontrado" })
  findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.chatService.findOne(id, user.id);
  }

  @Get(":id/messages")
  @ApiOperation({ summary: "Obter mensagens do chat" })
  @ApiResponse({ status: 200, description: "Mensagens do chat" })
  getMessages(@Param("id") id: string, @CurrentUser() user: any) {
    return this.chatService.getMessages(id, user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar nome do chat" })
  @ApiResponse({ status: 200, description: "Chat atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Chat não encontrado" })
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateChatSchema))
    updateChatDto: UpdateChatDto,
    @CurrentUser() user: any,
  ) {
    return this.chatService.update(id, user.id, updateChatDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Excluir chat" })
  @ApiResponse({ status: 200, description: "Chat excluído com sucesso" })
  @ApiResponse({ status: 404, description: "Chat não encontrado" })
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.chatService.remove(id, user.id);
  }

  @Get()
  findAllForUser(@CurrentUser() user: User) {
    return this.chatService.findAllForUser(user.id);
  }

  @Get(":id")
  findById(@Param("id") id: string, @CurrentUser() user: User) {
    return this.chatService.findById(id, user.id);
  }
}
