import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import {
  comparePasswords,
  createSession,
  hashPassword,
  signToken,
  verifyToken,
} from "../../lib/auth";
import { randomUUID } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException("E-mail já está em uso");
    }

    const passwordHash = await hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        email,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await this.prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: "credentials",
        providerId: "credentials",
        userId: user.id,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const token = signToken(user.id);
    await createSession(user.id, token);

    return { token };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const credentialsAccount = user.accounts.find(
      (acc) => acc.providerId === "credentials" && acc.password,
    );

    if (!credentialsAccount) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const valid = await comparePasswords(
      password,
      credentialsAccount.password!,
    );
    if (!valid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const token = signToken(user.id);
    await createSession(user.id, token);

    return { token };
  }

  async validateSession(authHeader: string) {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const dbSession = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!dbSession || dbSession.expiresAt < new Date()) {
      return null;
    }

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

  /**
   * Gera novo access token realizando rotação de refresh token.
   * Recebe o token atual (refresh) enviado pelo cliente.
   */
  async refresh(oldToken: string) {
    const decoded = verifyToken(oldToken);
    if (!decoded) {
      throw new UnauthorizedException("Token inválido");
    }

    // Busca sessão existente
    const session = await this.prisma.session.findUnique({
      where: { token: oldToken },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Sessão expirada ou não encontrada");
    }

    // Gera novo token e nova data de expiração
    const newToken = signToken(session.userId);
    const newExpires = await createSession(session.userId, newToken);

    // Remove o refresh token antigo (rotação)
    await this.prisma.session.delete({ where: { token: oldToken } });

    return { token: newToken, expiresAt: newExpires };
  }
}
