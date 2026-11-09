import type { ReactNode } from "react";
import { MAIN_CONTENT_ID, SiteFooter, SiteHeader } from "@/components/layout";

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
