import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChatDto {
  @ApiProperty({
    description: "Novo nome do chat",
    example: "Conversa sobre nutrição",
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;
}
