import { z } from "zod";

export const updateChatSchema = z.object({
  name: z.string().min(1).max(50),
});

export type UpdateChatDto = z.infer<typeof updateChatSchema>;
