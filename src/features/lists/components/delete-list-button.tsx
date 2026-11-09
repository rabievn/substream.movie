"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { deleteList } from "../server/actions";

export function DeleteListButton({ listId }: { listId: string }) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(async () => void (await deleteList(listId)))}
    >
      <Trash2 aria-hidden="true" />
      {t.lists.deleteList}
    </Button>
  );
}
