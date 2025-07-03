import { z } from "zod";

export enum ActivityIntensity {
  BAIXA = "Baixa",
  MEDIA = "Média",
  ALTA = "Alta",
}

export const createActivitySchema = z.object({
  name: z.string().min(1),
  intensity: z.nativeEnum(ActivityIntensity),
  duration: z.string().min(1),
  emoji: z.string().optional(),
});

export type CreateActivityDto = z.infer<typeof createActivitySchema>;
