"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { signInSchema, type SignInInput } from "../schemas/sign-in-schema";
import { signInWithEmail, signInWithGoogle } from "../server/actions";
import styles from "./sign-in-form.module.scss";

interface SignInFormProps {
  callbackUrl: string;
  isGoogleEnabled: boolean;
}

export function SignInForm({ callbackUrl, isGoogleEnabled }: SignInFormProps) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", callbackUrl },
  });

  const handleFormSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signInWithEmail({ email: values.email, callbackUrl });
      if (result.error) setServerError(t.auth[result.error]);
    });
  });

  return (
    <div className={styles.root}>
      <form onSubmit={handleFormSubmit} noValidate className={styles.form}>
        <TextField
          label={t.auth.emailLabel}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t.auth.emailPlaceholder}
          error={errors.email ? t.auth.invalidEmail : undefined}
          {...register("email")}
        />
        {serverError ? (
          <p role="alert" className={styles.error}>
            {serverError}
          </p>
        ) : null}
        <Button type="submit" size="lg" isFullWidth disabled={isPending}>
          {isPending ? t.auth.sending : t.auth.sendLink}
        </Button>
      </form>
      {isGoogleEnabled ? (
        <>
          <p className={styles.divider}>
            <span>{t.auth.orDivider}</span>
          </p>
          <form action={signInWithGoogle.bind(null, callbackUrl)}>
            <Button type="submit" size="lg" variant="outline" isFullWidth>
              {t.auth.continueWithGoogle}
            </Button>
          </form>
        </>
      ) : null}
    </div>
  );
}
