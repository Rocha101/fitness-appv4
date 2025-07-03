import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createChatDto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        name: createChatDto.name || "Novo Chat",
        userId,
      },
      include: {
        messages: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get only the last message for preview
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException("Chat não encontrado");
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar este chat",
      );
    }

    return chat;
  }

  async update(id: string, userId: string, updateChatDto: UpdateChatDto) {
    const chat = await this.findOne(id, userId);

    return this.prisma.chat.update({
      where: { id },
      data: { name: updateChatDto.name },
    });
  }

  async remove(id: string, userId: string) {
    const chat = await this.findOne(id, userId);

    return this.prisma.chat.delete({
      where: { id },
    });
  }

  async addMessage(
    chatId: string,
    userId: string,
    content: string,
    isUser: boolean = true,
  ) {
    // Ensure chat exists and belongs to user
    await this.findOne(chatId, userId);

    const message = await this.prisma.message.create({
      data: {
        content,
        isUser,
        chatId,
      },
    });

    // Update chat's updatedAt timestamp
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getMessages(chatId: string, userId: string) {
    // Ensure chat exists and belongs to user
    await this.findOne(chatId, userId);

    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findById(id: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id, userId },
    });

    if (!chat) {
      throw new NotFoundException("Chat não encontrado");
    }

    if (chat.userId !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar este chat",
      );
    }

    return chat;
  }
}
