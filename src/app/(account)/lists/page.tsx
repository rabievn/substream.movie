import type { Metadata } from "next";
import { requireUser } from "@/features/auth/server";
import { ListsView } from "@/features/lists";
import { getUserLists } from "@/features/lists/server";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "../profile/page.module.scss";

export const metadata: Metadata = { title: "My lists" };

export default async function ListsPage() {
  const user = await requireUser("/lists");
  const [t, locale, lists] = await Promise.all([
    getDictionary(),
    getLocale(),
    getUserLists(user.id),
  ]);

  return (
    <div className={styles.settings}>
      <h1 className={styles.name}>{t.lists.title}</h1>
      <ListsView lists={lists} t={t} locale={locale} />
    </div>
  );
}
