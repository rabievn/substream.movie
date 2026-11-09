import "server-only";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

export interface PlaybackTrack {
  id: string;
  language: string;
  label: string;
  url: string;
}

/** Everything the watch page needs for one movie or episode. */
export async function getPlayback(slug: string, episodeId: string | undefined, locale: Locale) {
  const title = await db.title.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      type: true,
      originalTitle: true,
      localizedTitle: true,
      releaseDate: true,
      videoUrl: true,
      durationMinutes: true,
      subtitleTracks: { select: { id: true, language: true, kind: true, label: true, url: true } },
      seasons: {
        orderBy: { number: "asc" },
        select: {
          number: true,
          episodes: {
            orderBy: { number: "asc" },
            select: {
              id: true,
              number: true,
              name: true,
              videoUrl: true,
              durationSeconds: true,
              subtitleTracks: {
                select: { id: true, language: true, kind: true, label: true, url: true },
              },
            },
          },
        },
      },
    },
  });
  if (!title || (title.releaseDate && title.releaseDate > new Date())) return null;

  const episodes = title.seasons.flatMap((season) =>
    season.episodes.map((episode) => ({ ...episode, seasonNumber: season.number })),
  );
  const episodeIndex = episodeId ? episodes.findIndex((episode) => episode.id === episodeId) : 0;
  const episode = episodes.length > 0 ? episodes[Math.max(0, episodeIndex)] : undefined;

  const videoUrl = episode?.videoUrl ?? title.videoUrl;
  if (!videoUrl) return null;

  const tracks = episode?.subtitleTracks ?? title.subtitleTracks;
  const pickTrack = (kind: "ORIGINAL" | "TRANSLATION"): PlaybackTrack | null => {
    const candidates = tracks.filter((track) => track.kind === kind);
    const track =
      (kind === "TRANSLATION" ? candidates.find((item) => item.language === locale) : undefined) ??
      candidates[0];
    return track
      ? { id: track.id, language: track.language, label: track.label, url: track.url }
      : null;
  };

  const position = episode ? episodes.indexOf(episode) : -1;
  return {
    titleId: title.id,
    titleSlug: title.slug,
    displayTitle:
      locale === "ru" && title.localizedTitle ? title.localizedTitle : title.originalTitle,
    videoUrl,
    episode: episode
      ? { id: episode.id, season: episode.seasonNumber, number: episode.number, name: episode.name }
      : null,
    previousEpisodeId: position > 0 ? episodes[position - 1]!.id : null,
    nextEpisodeId:
      position >= 0 && position < episodes.length - 1 ? episodes[position + 1]!.id : null,
    originalTrack: pickTrack("ORIGINAL"),
    translationTrack: pickTrack("TRANSLATION"),
  };
}

export type Playback = NonNullable<Awaited<ReturnType<typeof getPlayback>>>;
