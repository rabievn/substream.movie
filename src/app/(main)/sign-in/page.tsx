import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { isGoogleAuthEnabled } from "@/config/server-env";
import { SignInForm, signInSchema } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server";
import { getDictionary } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

export const metadata: Metadata = { title: "Sign in" };

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl: rawCallbackUrl } = await searchParams;
  // The schema falls back to "/profile" for missing or unsafe values.
  const callbackUrl = signInSchema.shape.callbackUrl.parse(rawCallbackUrl);

  if (await getCurrentUser()) redirect(callbackUrl);
  const t = await getDictionary();

  return (
    <Container className={styles.root}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.auth.signInTitle}</h1>
        <p className={styles.subtitle}>{t.auth.signInSubtitle}</p>
        <SignInForm callbackUrl={callbackUrl} isGoogleEnabled={isGoogleAuthEnabled} />
      </div>
    </Container>
  );
}
