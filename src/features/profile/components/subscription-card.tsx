import { Badge, type BadgeVariant } from "@/components/ui";
import { format, type Dictionary } from "@/lib/i18n";
import type { SubscriptionStatus } from "@/generated/prisma/enums";
import { getDaysLeft } from "../subscription";
import styles from "./card.module.scss";

interface SubscriptionCardProps {
  subscription: { plan: string; status: SubscriptionStatus; expiresAt: Date } | null;
  t: Dictionary["profile"];
}

const STATUS_BADGE: Record<SubscriptionStatus, BadgeVariant> = {
  TRIAL: "secondary",
  ACTIVE: "accent",
  EXPIRED: "neutral",
  CANCELED: "neutral",
};

const STATUS_LABEL_KEY = {
  TRIAL: "statusTrial",
  ACTIVE: "statusActive",
  EXPIRED: "statusExpired",
  CANCELED: "statusCanceled",
} as const satisfies Record<SubscriptionStatus, keyof Dictionary["profile"]>;

export function SubscriptionCard({ subscription, t }: SubscriptionCardProps) {
  if (!subscription) return null;
  const daysLeft = getDaysLeft(subscription.expiresAt);
  const isExpired = daysLeft === 0;
  const status = isExpired ? "EXPIRED" : subscription.status;

  return (
    <section className={styles.root} aria-labelledby="subscription-heading">
      <h2 id="subscription-heading" className={styles.heading}>
        {t.subscription}
      </h2>
      <div className={styles.row}>
        <Badge variant={STATUS_BADGE[status]}>{t[STATUS_LABEL_KEY[status]]}</Badge>
        <span className={styles.muted}>
          {t.plan}: {subscription.plan}
        </span>
      </div>
      <p className={styles.big}>
        {isExpired ? t.expired : format(t.daysLeft, { count: daysLeft })}
      </p>
    </section>
  );
}
