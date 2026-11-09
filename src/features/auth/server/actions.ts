"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signInSchema } from "../schemas/sign-in-schema";
import { signIn, signOut } from "./auth";

export interface SignInState {
  error?: "invalidEmail" | "failed";
}

export async function signInWithEmail(input: {
  email: string;
  callbackUrl: string;
}): Promise<SignInState> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { error: "invalidEmail" };

  try {
    await signIn("nodemailer", {
      email: parsed.data.email,
      redirectTo: parsed.data.callbackUrl,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "failed" };
    throw error;
  }
  redirect("/sign-in/check-email");
}

export async function signInWithGoogle(callbackUrl: string) {
  const { callbackUrl: safeUrl } = signInSchema.parse({ email: "x@x.xx", callbackUrl });
  await signIn("google", { redirectTo: safeUrl });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
