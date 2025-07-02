import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createActivityDto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: {
        ...createActivityDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException("Atividade não encontrada");
    }

    if (activity.userId !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar esta atividade",
      );
    }

    return activity;
  }

  async update(
    id: string,
    userId: string,
    updateActivityDto: UpdateActivityDto,
  ) {
    const activity = await this.findOne(id, userId);

    return this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
  }

  async remove(id: string, userId: string) {
    const activity = await this.findOne(id, userId);

    return this.prisma.activity.delete({
      where: { id },
    });
  }

  async getStats(userId: string) {
    const totalActivities = await this.prisma.activity.count({
      where: { userId },
    });

    const recentActivities = await this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return {
      totalActivities,
      recentActivities,
    };
  }
}
