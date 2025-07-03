import { z } from "zod";

export const createChatSchema = z.object({
  name: z.string().min(1).max(50).optional().default("Novo Chat"),
});

export type CreateChatDto = z.infer<typeof createChatSchema>;
