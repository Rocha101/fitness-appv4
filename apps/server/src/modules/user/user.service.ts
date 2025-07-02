import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return user;
  }

  async getProfile(id: string) {
    return this.findById(id);
  }

  async updateProfile(id: string, data: { name?: string; email?: string }) {
    const user = await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteAccount(id: string) {
    const user = await this.findById(id);

    // Delete user and all related data (cascading)
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
