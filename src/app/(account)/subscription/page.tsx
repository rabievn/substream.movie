import type { Metadata } from "next";
import { requireUser } from "@/features/auth/server";
import { SubscriptionCard } from "@/features/profile";
import { getProfile } from "@/features/profile/server";
import { format } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "../profile/page.module.scss";

export const metadata: Metadata = { title: "Subscription" };

export default async function SubscriptionPage() {
  const user = await requireUser("/subscription");
  const [t, locale, profile] = await Promise.all([
    getDictionary(),
    getLocale(),
    getProfile(user.id),
  ]);
  const expiresAt = profile.subscription?.expiresAt;

  return (
    <div className={styles.settings}>
      <h1 className={styles.name}>{t.subscriptionPage.title}</h1>
      <div className={styles.cards}>
        <SubscriptionCard subscription={profile.subscription} t={t.profile} />
      </div>
      {expiresAt ? (
        <p>
          {format(t.subscriptionPage.expiresOn, {
            date: new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(expiresAt),
          })}
        </p>
      ) : null}
      <p>{t.subscriptionPage.perks}</p>
      <p className={styles.muted}>{t.subscriptionPage.noPayments}</p>
    </div>
  );
}
