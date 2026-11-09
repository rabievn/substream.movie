import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container } from "@/components/ui";
import { getCurrentUser } from "@/features/auth/server";
import { getPlayback } from "@/features/player/server";
import { getResumePosition } from "@/features/watch-progress/server";
import { format } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";
import { WatchPlayer } from "./watch-player";

interface WatchPageProps {
  /** Title slug */
  params: Promise<{ id: string }>;
  /** e = episode id (series) */
  searchParams: Promise<{ e?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const playback = await getPlayback((await params).id, (await searchParams).e, await getLocale());
  return { title: playback?.displayTitle, robots: { index: false } };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const [{ id }, { e: episodeId }, t, locale] = await Promise.all([
    params,
    searchParams,
    getDictionary(),
    getLocale(),
  ]);
  const [playback, user] = await Promise.all([
    getPlayback(id, episodeId, locale),
    getCurrentUser(),
  ]);
  if (!playback) notFound();
  const startAt = user
    ? await getResumePosition(user.id, playback.titleId, playback.episode?.id ?? null)
    : 0;
  const currentPath = `/watch/${playback.titleSlug}${playback.episode ? `?e=${playback.episode.id}` : ""}`;

  const episodeHref = (targetId: string) => `/watch/${playback.titleSlug}?e=${targetId}`;

  return (
    <Container className={styles.root}>
      <header className={styles.header}>
        <Link href={`/title/${playback.titleSlug}`} className={styles.back}>
          <ArrowLeft aria-hidden="true" size={18} />
          {t.player.back}
        </Link>
        <h1 className={styles.title}>
          {playback.displayTitle}
          {playback.episode ? (
            <span className={styles.episode}>
              {format(t.player.episodeLabel, playback.episode)} · {playback.episode.name}
            </span>
          ) : null}
        </h1>
      </header>

      <WatchPlayer
        key={playback.videoUrl + (playback.episode?.id ?? "")}
        titleId={playback.titleId}
        episodeId={playback.episode?.id ?? null}
        startAt={startAt}
        src={playback.videoUrl}
        originalTrack={playback.originalTrack}
        translationTrack={playback.translationTrack}
        isSignedIn={Boolean(user)}
        signInHref={`/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`}
      />

      <div className={styles.footer}>
        <p className={styles.hint}>{t.player.shortcuts}</p>
        {playback.episode ? (
          <nav className={styles.episodeNav} aria-label={t.titlePage.seasons}>
            {playback.previousEpisodeId ? (
              <Button asChild variant="secondary" size="sm">
                <Link href={episodeHref(playback.previousEpisodeId)}>
                  <ChevronLeft aria-hidden="true" />
                  {t.player.previousEpisode}
                </Link>
              </Button>
            ) : null}
            {playback.nextEpisodeId ? (
              <Button asChild variant="secondary" size="sm">
                <Link href={episodeHref(playback.nextEpisodeId)}>
                  {t.player.nextEpisode}
                  <ChevronRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </nav>
        ) : null}
      </div>
    </Container>
  );
}
