import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_CONFIG } from "@/config/site";
import { StoreProvider } from "@/store/store-provider";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: { default: SITE_CONFIG.name, template: `%s · ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
