import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SkipLink, ThemeScript } from "@/components/layout";
import { SITE_CONFIG } from "@/config/site";
import { dictionaries } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/get-locale";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { StoreProvider } from "@/store/store-provider";
import "@/styles/globals.scss";
import { manropeCyrillic, manropeLatin } from "./fonts";

export const metadata: Metadata = {
  title: { default: SITE_CONFIG.name, template: `%s · ${SITE_CONFIG.name}` },
  description: SITE_CONFIG.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e12" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();

  return (
    // data-theme is set before paint by ThemeScript, so the attribute may differ from SSR.
    <html
      lang={locale}
      className={`${manropeLatin.variable} ${manropeCyrillic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <SkipLink label={dictionaries[locale].common.skipToContent} />
        <I18nProvider locale={locale}>
          <StoreProvider>{children}</StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
