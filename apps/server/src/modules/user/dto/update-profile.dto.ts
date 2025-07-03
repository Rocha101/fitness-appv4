import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  activityGoal: z.number().optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
