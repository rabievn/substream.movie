import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

/** Current user or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email) return null;
  return { id: user.id, name: user.name ?? null, email: user.email, image: user.image ?? null };
});

/** Current user, or redirect to sign-in and come back to `returnTo` afterwards. */
export async function requireUser(returnTo = "/profile"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?callbackUrl=${encodeURIComponent(returnTo)}`);
  return user;
}
