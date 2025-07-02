import { IsString, IsOptional, MaxLength, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateChatDto {
  @ApiPropertyOptional({
    description: "Nome do chat",
    example: "Conversa sobre treino",
    default: "Novo Chat",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string = "Novo Chat";
}
