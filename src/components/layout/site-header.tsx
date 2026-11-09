import { Search, UserRound } from "lucide-react";
import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/get-locale";
import { LocaleSwitch } from "./locale-switch";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import styles from "./site-header.module.scss";
import { ThemeToggle } from "./theme-toggle";

export async function SiteHeader() {
  const t = await getDictionary();

  return (
    <header className={styles.root}>
      <Container className={styles.inner}>
        <MobileNav />
        <Logo />
        <nav aria-label={t.nav.mainNavigation} className={styles.desktopNav}>
          <NavLinks />
        </nav>
        <div className={styles.actions}>
          <Link href="/search" className={styles.iconLink} aria-label={t.nav.search}>
            <Search aria-hidden="true" />
          </Link>
          <span className={styles.desktopOnly}>
            <LocaleSwitch />
          </span>
          <ThemeToggle />
          <Button asChild size="sm" variant="secondary" className={styles.desktopOnly}>
            <Link href="/profile">
              <UserRound aria-hidden="true" />
              {t.nav.profile}
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
