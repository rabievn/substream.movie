import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDisplayTitle, TitleDetailsView } from "@/features/catalog";
import { getTitleDetails } from "@/features/catalog/server";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";

interface TitlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TitlePageProps): Promise<Metadata> {
  const locale = await getLocale();
  const title = await getTitleDetails((await params).slug, locale);
  if (!title) return {};
  return { title: getDisplayTitle(title, locale), description: title.description };
}

export default async function TitlePage({ params }: TitlePageProps) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const title = await getTitleDetails((await params).slug, locale);
  if (!title) notFound();

  return <TitleDetailsView title={title} t={t} locale={locale} />;
}
