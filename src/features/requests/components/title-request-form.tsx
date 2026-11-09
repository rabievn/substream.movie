"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import {
  titleRequestSchema,
  type TitleRequestFormValues,
  type TitleRequestInput,
} from "../schemas/title-request-schema";
import { createTitleRequest } from "../server/actions";
import styles from "./title-request-form.module.scss";

export function TitleRequestForm() {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TitleRequestFormValues, unknown, TitleRequestInput>({
    resolver: zodResolver(titleRequestSchema),
    defaultValues: { name: "", year: "", comment: "" },
  });

  const handleFormSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createTitleRequest(values);
      setStatus(result.ok ? "sent" : "failed");
      if (result.ok) reset();
    });
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate className={styles.root}>
      <TextField
        label={t.requests.nameLabel}
        error={errors.name ? t.requests.nameRequired : undefined}
        {...register("name")}
      />
      <TextField
        label={t.requests.yearLabel}
        inputMode="numeric"
        error={errors.year ? t.requests.yearInvalid : undefined}
        {...register("year")}
      />
      <label className={styles.field}>
        <span className={styles.label}>{t.requests.commentLabel}</span>
        <textarea className={styles.textarea} rows={3} maxLength={500} {...register("comment")} />
      </label>
      <div className={styles.actions}>
        <Button type="submit" disabled={isPending}>
          {isPending ? t.requests.sending : t.requests.submit}
        </Button>
        <p role="status" className={styles.status}>
          {status === "sent" ? t.requests.sent : status === "failed" ? t.dictionary.error : null}
        </p>
      </div>
    </form>
  );
}
