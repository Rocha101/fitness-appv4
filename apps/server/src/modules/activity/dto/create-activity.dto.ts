import { IsString, IsEnum, IsOptional, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum ActivityIntensity {
  BAIXA = "Baixa",
  MEDIA = "Média",
  ALTA = "Alta",
}

export class CreateActivityDto {
  @ApiProperty({
    description: "Nome da atividade",
    example: "Corrida no parque",
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: "Intensidade da atividade",
    enum: ActivityIntensity,
    example: ActivityIntensity.MEDIA,
  })
  @IsEnum(ActivityIntensity)
  intensity: ActivityIntensity;

  @ApiProperty({
    description: "Duração da atividade",
    example: "30 minutos",
  })
  @IsString()
  @MinLength(1)
  duration: string;

  @ApiPropertyOptional({
    description: "Emoji representativo da atividade",
    example: "🏃‍♂️",
  })
  @IsOptional()
  @IsString()
  emoji?: string;
}
