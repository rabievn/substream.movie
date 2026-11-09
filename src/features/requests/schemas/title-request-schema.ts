import { z } from "zod";

const currentYear = new Date().getFullYear();

export const titleRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  year: z
    .union([
      z.literal(""),
      z.coerce
        .number()
        .int()
        .min(1900)
        .max(currentYear + 5),
    ])
    .transform((value) => (value === "" ? null : value)),
  comment: z.string().trim().max(500),
});

export type TitleRequestFormValues = z.input<typeof titleRequestSchema>;
export type TitleRequestInput = z.output<typeof titleRequestSchema>;
