"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button, SelectField, TextField } from "@/components/ui";
import { LOCALES } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { profileSchema, type ProfileInput } from "../schemas/profile-schema";
import { updateProfile } from "../server/actions";
import styles from "./profile-form.module.scss";

type SaveStatus = "idle" | "saved" | "failed";

export function ProfileForm({ defaultValues }: { defaultValues: ProfileInput }) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues });

  const handleFormSubmit = handleSubmit((values) => {
    setSaveStatus("idle");
    startTransition(async () => {
      const result = await updateProfile(values);
      setSaveStatus(result.ok ? "saved" : "failed");
      if (result.ok) reset(values);
    });
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate className={styles.root}>
      <TextField
        label={t.profile.nameLabel}
        autoComplete="name"
        error={errors.name ? t.profile.nameTooLong : undefined}
        {...register("name")}
      />
      <SelectField
        label={t.profile.localeLabel}
        options={LOCALES.map((locale) => ({ value: locale, label: t.locale[locale] }))}
        {...register("locale")}
      />
      <div className={styles.actions}>
        <Button type="submit" disabled={isPending || !isDirty}>
          {isPending ? t.profile.saving : t.profile.save}
        </Button>
        <p role="status" className={styles.status}>
          {saveStatus === "saved" ? t.profile.saved : null}
          {saveStatus === "failed" ? t.profile.saveFailed : null}
        </p>
      </div>
    </form>
  );
}
