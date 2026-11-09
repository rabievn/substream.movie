import type { Metadata } from "next";
import { Badge, Section } from "@/components/ui";
import { requireUser } from "@/features/auth/server";
import { TitleRequestForm } from "@/features/requests";
import { getUserRequests } from "@/features/requests/server";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "../profile/page.module.scss";

export const metadata: Metadata = { title: "Title requests" };

export default async function RequestsPage() {
  const user = await requireUser("/requests");
  const [t, locale, requests] = await Promise.all([
    getDictionary(),
    getLocale(),
    getUserRequests(user.id),
  ]);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div className={styles.settings}>
      <h1 className={styles.name}>{t.requests.title}</h1>
      <p className={styles.muted}>{t.requests.intro}</p>
      <TitleRequestForm />
      <Section title={t.requests.yours}>
        {requests.length === 0 ? (
          <p className={styles.muted}>{t.requests.none}</p>
        ) : (
          <ul role="list" className={styles.cards}>
            {requests.map((request) => (
              <li key={request.id}>
                <strong>{request.name}</strong>
                {request.year ? ` (${request.year})` : ""} · {dateFormat.format(request.createdAt)}{" "}
                <Badge variant={request.status === "ADDED" ? "levelA" : "neutral"}>
                  {t.requests[`status${request.status}`]}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
