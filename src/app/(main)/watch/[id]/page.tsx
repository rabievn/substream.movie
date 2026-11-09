import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container } from "@/components/ui";
import { VideoPlayer } from "@/features/player";
import { getPlayback } from "@/features/player/server";
import { format } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

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
  const playback = await getPlayback(id, episodeId, locale);
  if (!playback) notFound();

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

      <VideoPlayer
        key={playback.videoUrl + (playback.episode?.id ?? "")}
        src={playback.videoUrl}
        originalTrack={playback.originalTrack}
        translationTrack={playback.translationTrack}
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
