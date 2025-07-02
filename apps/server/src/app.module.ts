import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { ActivityModule } from "./modules/activity/activity.module";
import { ChatModule } from "./modules/chat/chat.module";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { AiModule } from "./modules/ai/ai.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    ActivityModule,
    ChatModule,
    AiModule,
  ],
})
export class AppModule {}
