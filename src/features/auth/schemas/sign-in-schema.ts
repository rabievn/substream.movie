import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  callbackUrl: z
    .string()
    // Only same-site relative paths, to avoid open redirects.
    .refine((value) => value.startsWith("/") && !value.startsWith("//"))
    .catch("/profile"),
});

export type SignInInput = z.input<typeof signInSchema>;
