"use client";

import clsx from "clsx";
import { BookOpen, CreditCard, HelpCircle, Inbox, ListVideo, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/i18n-provider";
import styles from "./account-nav.module.scss";

const ITEMS = [
  { href: "/profile", key: "profile", Icon: UserRound },
  { href: "/dictionary", key: "dictionary", Icon: BookOpen },
  { href: "/lists", key: "lists", Icon: ListVideo },
  { href: "/requests", key: "requests", Icon: Inbox },
  { href: "/subscription", key: "subscription", Icon: CreditCard },
  { href: "/help", key: "help", Icon: HelpCircle },
] as const;

export function AccountNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav aria-label={t.account.navLabel}>
      <ul role="list" className={styles.list}>
        {ITEMS.map(({ href, key, Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(styles.link, isActive && styles.isActive)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" />
                {t.account[key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
