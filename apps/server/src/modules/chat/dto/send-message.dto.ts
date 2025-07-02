import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
  @ApiProperty({
    description: "Conteúdo da mensagem",
    example: "Qual é o melhor exercício para fortalecer o core?",
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
