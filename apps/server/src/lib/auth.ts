import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import prisma from "../../prisma";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "insecure_secret";
const JWT_EXPIRES_IN = "30d";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, token: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  await prisma.session.create({
    data: {
      id: randomUUID(),
      expiresAt,
      token,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    },
  });
  return expiresAt;
}
