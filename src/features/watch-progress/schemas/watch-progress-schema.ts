import { z } from "zod";

export const FINISHED_THRESHOLD = 0.95;

export const updateWatchProgressSchema = z
  .object({
    titleId: z.string().min(1).max(64),
    episodeId: z.string().min(1).max(64).nullish(),
    positionSeconds: z.number().min(0).max(86_400),
    durationSeconds: z.number().positive().max(86_400),
  })
  .refine((value) => value.positionSeconds <= value.durationSeconds + 1, {
    message: "position exceeds duration",
  });

export type UpdateWatchProgressInput = z.infer<typeof updateWatchProgressSchema>;

export const isFinished = (position: number, duration: number) =>
  duration > 0 && position / duration >= FINISHED_THRESHOLD;
