import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getDisplayTitle, TitleDetailsView } from "@/features/catalog";
import { getTitleDetails } from "@/features/catalog/server";
import Link from "next/link";
import { Button } from "@/components/ui";
import { getCurrentUser } from "@/features/auth/server";
import { AddToListMenu } from "@/features/lists";
import { getListMembership } from "@/features/lists/server";
import { NotifyButton } from "@/features/upcoming";
import { getNotificationTitleIds } from "@/features/upcoming/server";
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
  const [title, user] = await Promise.all([
    getTitleDetails((await params).slug, locale),
    getCurrentUser(),
  ]);
  if (!title) notFound();

  let actions: ReactNode;
  if (!user) {
    actions = (
      <Button asChild variant="secondary" size="lg">
        <Link href={`/sign-in?callbackUrl=/title/${title.slug}`}>{t.lists.signInToUse}</Link>
      </Button>
    );
  } else if (title.isUpcoming) {
    const notified = await getNotificationTitleIds(user.id);
    actions = (
      <NotifyButton titleId={title.id} isSubscribed={notified.includes(title.id)} size="lg" />
    );
  } else {
    actions = (
      <AddToListMenu titleId={title.id} lists={await getListMembership(user.id, title.id)} />
    );
  }

  return <TitleDetailsView title={title} t={t} locale={locale} actions={actions} />;
}
