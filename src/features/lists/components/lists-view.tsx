import { Section } from "@/components/ui";
import { TitleCard, TitleGrid } from "@/features/catalog";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getListName } from "../list-name";
import type { getUserLists } from "../server/lists";
import { CreateListForm } from "./create-list-form";
import { DeleteListButton } from "./delete-list-button";
import styles from "./lists-view.module.scss";

interface ListsViewProps {
  lists: Awaited<ReturnType<typeof getUserLists>>;
  t: Dictionary;
  locale: Locale;
}

export function ListsView({ lists, t, locale }: ListsViewProps) {
  return (
    <div className={styles.root}>
      <CreateListForm />
      {lists.map((list) => (
        <Section key={list.id} title={`${getListName(list, t)} · ${list.titles.length}`}>
          {list.systemKey ? null : <DeleteListButton listId={list.id} />}
          {list.titles.length === 0 ? (
            <p className={styles.empty}>{t.lists.empty}</p>
          ) : (
            <TitleGrid>
              {list.titles.map((title) => (
                <li key={title.id}>
                  <TitleCard title={title} locale={locale} />
                </li>
              ))}
            </TitleGrid>
          )}
        </Section>
      ))}
    </div>
  );
}
