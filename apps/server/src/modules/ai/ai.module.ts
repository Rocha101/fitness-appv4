import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { ChatModule } from "../chat/chat.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [ChatModule, AuthModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
