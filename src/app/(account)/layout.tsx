import type { ReactNode } from "react";
import { AccountNav, MAIN_CONTENT_ID, SiteFooter, SiteHeader } from "@/components/layout";
import { Container } from "@/components/ui";
import { requireUser } from "@/features/auth/server";
import styles from "./layout.module.scss";

export default async function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireUser();

  return (
    <>
      <SiteHeader />
      <Container className={styles.root}>
        <AccountNav />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
          {children}
        </main>
      </Container>
      <SiteFooter />
    </>
  );
}
