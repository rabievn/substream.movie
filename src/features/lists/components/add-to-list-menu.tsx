"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ListPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { getListName } from "../list-name";
import type { ListMembership } from "../server/lists";
import { toggleListItem } from "../server/actions";
import styles from "./add-to-list-menu.module.scss";

interface AddToListMenuProps {
  titleId: string;
  lists: ListMembership[];
}

export function AddToListMenu({ titleId, lists }: AddToListMenuProps) {
  const { t } = useI18n();
  const [, startTransition] = useTransition();
  const [optimisticLists, setOptimisticLists] = useState(lists);
  const setListHasTitle = (listId: string, hasTitle: boolean) =>
    setOptimisticLists((current) =>
      current.map((list) => (list.id === listId ? { ...list, hasTitle } : list)),
    );
  const isInAnyList = optimisticLists.some((list) => list.hasTitle);

  const handleToggle = (listId: string, hasTitle: boolean) => {
    setListHasTitle(listId, hasTitle); // optimistic
    startTransition(async () => {
      const result = await toggleListItem({ listId, titleId, isAdded: hasTitle });
      if (!result.ok) setListHasTitle(listId, !hasTitle);
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" size="lg">
          {isInAnyList ? <Check aria-hidden="true" /> : <ListPlus aria-hidden="true" />}
          {isInAnyList ? t.lists.inLists : t.lists.addToList}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.content} sideOffset={8} align="start">
          {optimisticLists.map((list) => (
            <DropdownMenu.CheckboxItem
              key={list.id}
              className={styles.item}
              checked={list.hasTitle}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) => handleToggle(list.id, checked === true)}
            >
              <span className={styles.check} aria-hidden="true">
                <DropdownMenu.ItemIndicator>
                  <Check size={16} />
                </DropdownMenu.ItemIndicator>
              </span>
              {getListName(list, t)}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
