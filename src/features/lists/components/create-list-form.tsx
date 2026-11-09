"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { createListSchema, type CreateListInput } from "../schemas/list-schemas";
import { createList } from "../server/actions";
import styles from "./create-list-form.module.scss";

export function CreateListForm() {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: { name: "" },
  });

  const handleFormSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await createList(values);
      if (result.ok) reset();
      else setError("name", { message: result.error });
    }),
  );

  return (
    <form onSubmit={handleFormSubmit} noValidate className={styles.root}>
      <TextField
        label={t.lists.newListLabel}
        maxLength={60}
        error={errors.name ? t.lists.nameRequired : undefined}
        {...register("name")}
      />
      <Button type="submit" disabled={isPending}>
        {t.lists.createList}
      </Button>
    </form>
  );
}
