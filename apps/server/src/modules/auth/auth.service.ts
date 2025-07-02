import { Injectable } from "@nestjs/common";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  private auth: ReturnType<typeof betterAuth>;

  constructor(private prisma: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: "postgresql",
      }),
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
      trustedOrigins: [
        ...(process.env.CORS_ORIGIN?.split(",").map((origin) =>
          origin.trim(),
        ) || []),
        "my-better-t-app://",
      ],
      emailAndPassword: {
        enabled: true,
      },
      user: {
        changeEmail: {
          enabled: true,
        },
        deleteUser: {
          enabled: true,
        },
      },
      plugins: [expo()],
    });
  }

  get instance() {
    return this.auth;
  }

  async validateSession(token: string) {
    try {
      // Remove Bearer prefix if present
      const sessionToken = token.startsWith("Bearer ")
        ? token.substring(7)
        : token;

      // Query the session directly from the database
      const dbSession = await this.prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (dbSession && dbSession.expiresAt > new Date()) {
        return {
          user: {
            id: dbSession.user.id,
            email: dbSession.user.email,
            name: dbSession.user.name,
          },
          session: {
            id: dbSession.id,
            userId: dbSession.userId,
            token: dbSession.token,
            expiresAt: dbSession.expiresAt,
          },
        };
      }

      return null;
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }
}
