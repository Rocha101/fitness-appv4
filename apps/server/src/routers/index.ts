import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	
	// Activity endpoints
	createActivity: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				intensity: z.enum(["Baixa", "Média", "Alta"]),
				duration: z.string().min(1),
				emoji: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const activity = await ctx.db.activity.create({
				data: {
					name: input.name,
					intensity: input.intensity,
					duration: input.duration,
					emoji: input.emoji,
					userId: ctx.session.user.id,
				},
			});
			return activity;
		}),

	updateActivity: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1),
				intensity: z.enum(["Baixa", "Média", "Alta"]),
				duration: z.string().min(1),
				emoji: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const activity = await ctx.db.activity.update({
				where: {
					id: input.id,
					userId: ctx.session.user.id, // Ensure user can only update their own activities
				},
				data: {
					name: input.name,
					intensity: input.intensity,
					duration: input.duration,
					emoji: input.emoji,
				},
			});
			return activity;
		}),

	deleteActivity: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const activity = await ctx.db.activity.delete({
				where: {
					id: input.id,
					userId: ctx.session.user.id, // Ensure user can only delete their own activities
				},
			});
			return activity;
		}),

	getActivities: protectedProcedure.query(async ({ ctx }) => {
		const activities = await ctx.db.activity.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return activities;
	}),

	getActivityStats: protectedProcedure.query(async ({ ctx }) => {
		const totalActivities = await ctx.db.activity.count({
			where: {
				userId: ctx.session.user.id,
			},
		});

		const recentActivities = await ctx.db.activity.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 3,
		});

		return {
			totalActivities,
			recentActivities,
		};
	}),
});
export type AppRouter = typeof appRouter;
