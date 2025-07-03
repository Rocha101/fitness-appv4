import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@ApiTags("User")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @ApiOperation({ summary: "Obter perfil do usuário" })
  @ApiResponse({ status: 200, description: "Perfil do usuário" })
  getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.id);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Atualizar perfil do usuário" })
  @ApiResponse({ status: 200, description: "Perfil atualizado com sucesso" })
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updateProfile(user.id, updateProfileDto);
  }

  @Delete("account")
  @ApiOperation({ summary: "Excluir conta do usuário" })
  @ApiResponse({ status: 200, description: "Conta excluída com sucesso" })
  deleteAccount(@CurrentUser() user: any) {
    return this.userService.deleteAccount(user.id);
  }
}
