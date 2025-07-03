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
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { createActivitySchema } from "./dto/create-activity.dto";
import { updateActivitySchema } from "./dto/update-activity.dto";
import { ZodValidationPipe } from "@/lib/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("Activities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("activities")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: "Criar nova atividade" })
  @ApiResponse({ status: 201, description: "Atividade criada com sucesso" })
  create(
    @Body(new ZodValidationPipe(createActivitySchema))
    createActivityDto: CreateActivityDto,
    @CurrentUser() user: any,
  ) {
    return this.activityService.create(user.id, createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as atividades do usuário" })
  @ApiResponse({ status: 200, description: "Lista de atividades" })
  findAll(@CurrentUser() user: any) {
    return this.activityService.findAll(user.id);
  }

  @Get("stats")
  @ApiOperation({ summary: "Obter estatísticas das atividades" })
  @ApiResponse({
    status: 200,
    description: "Estatísticas das atividades (total, semana, recentes)",
  })
  getStats(@CurrentUser() user: any) {
    return this.activityService.getStats(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obter atividade por ID" })
  @ApiResponse({ status: 200, description: "Atividade encontrada" })
  @ApiResponse({ status: 404, description: "Atividade não encontrada" })
  findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.activityService.findOne(id, user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar atividade" })
  @ApiResponse({ status: 200, description: "Atividade atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Atividade não encontrada" })
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateActivitySchema))
    updateActivityDto: UpdateActivityDto,
    @CurrentUser() user: any,
  ) {
    return this.activityService.update(id, user.id, updateActivityDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Excluir atividade" })
  @ApiResponse({ status: 200, description: "Atividade excluída com sucesso" })
  @ApiResponse({ status: 404, description: "Atividade não encontrada" })
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.activityService.remove(id, user.id);
  }
}
