"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { MAIN_NAV_ITEMS } from "./nav-items";
import styles from "./nav-links.module.scss";

interface NavLinksProps {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}

export function NavLinks({ orientation = "horizontal", onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <ul role="list" className={clsx(styles.list, styles[orientation])}>
      {MAIN_NAV_ITEMS.map(({ href, labelKey }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              className={clsx(styles.link, isActive && styles.isActive)}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              {t.nav[labelKey]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
