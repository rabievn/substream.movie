/**
 * Idempotent development seed: `npm run db:seed`.
 * Upserts by slug, so it can run repeatedly without duplicates.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  COLLECTIONS,
  GENRES,
  PEOPLE,
  SAMPLE_SUBTITLES,
  SAMPLE_VIDEO_URL,
  TITLES,
  type SeedTitle,
} from "./seed-data";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_USER_EMAIL = "demo@substream.movie";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS);

function subtitleTracks() {
  return [
    { language: "en", kind: "ORIGINAL" as const, label: "English", url: SAMPLE_SUBTITLES.en },
    { language: "ru", kind: "TRANSLATION" as const, label: "Русский", url: SAMPLE_SUBTITLES.ru },
  ];
}

async function seedTitle(
  title: SeedTitle,
  genreIds: Map<string, string>,
  personIds: Map<string, string>,
) {
  const isUpcoming = (title.releaseInDays ?? 0) > 0;
  const isEpisodic = Boolean(title.seasons);

  const data = {
    type: title.type,
    originalTitle: title.originalTitle,
    localizedTitle: title.localizedTitle,
    tagline: title.tagline,
    description: title.description,
    descriptionRu: title.descriptionRu,
    year: title.year,
    durationMinutes: title.durationMinutes,
    cefrLevel: title.cefrLevel,
    language: title.language ?? "EN",
    countries: title.countries,
    ageRating: title.ageRating,
    imdbRating: title.imdbRating,
    otherRating: title.otherRating,
    popularity: title.popularity,
    isFeatured: title.isFeatured ?? false,
    releaseDate: title.releaseInDays ? daysFromNow(title.releaseInDays) : null,
    videoUrl: isUpcoming || isEpisodic ? null : SAMPLE_VIDEO_URL,
    createdAt: daysFromNow(-title.addedDaysAgo),
  };

  const saved = await db.title.upsert({
    where: { slug: title.slug },
    create: { slug: title.slug, ...data },
    update: data,
  });

  // Relations are rebuilt on every run to keep the seed idempotent.
  await db.$transaction([
    db.titleGenre.deleteMany({ where: { titleId: saved.id } }),
    db.credit.deleteMany({ where: { titleId: saved.id } }),
    db.season.deleteMany({ where: { titleId: saved.id } }),
    db.subtitleTrack.deleteMany({ where: { titleId: saved.id } }),
  ]);

  await db.titleGenre.createMany({
    data: title.genres.map((slug) => ({ titleId: saved.id, genreId: genreIds.get(slug)! })),
  });

  await db.credit.createMany({
    data: [
      ...title.cast.map((member, index) => ({
        titleId: saved.id,
        personId: personIds.get(member.person)!,
        role: "ACTOR" as const,
        character: member.character,
        order: index,
      })),
      {
        titleId: saved.id,
        personId: personIds.get(title.director)!,
        role: "DIRECTOR" as const,
        order: 0,
      },
    ],
  });

  if (isUpcoming) return saved;

  if (!isEpisodic) {
    await db.subtitleTrack.createMany({
      data: subtitleTracks().map((track) => ({ ...track, titleId: saved.id })),
    });
    return saved;
  }

  for (const [seasonIndex, episodeCount] of (title.seasons ?? []).entries()) {
    const season = await db.season.create({
      data: { titleId: saved.id, number: seasonIndex + 1 },
    });
    for (let number = 1; number <= episodeCount; number += 1) {
      await db.episode.create({
        data: {
          seasonId: season.id,
          number,
          name: `Episode ${number}`,
          durationSeconds: title.durationMinutes * 60,
          videoUrl: SAMPLE_VIDEO_URL,
          subtitleTracks: { create: subtitleTracks() },
        },
      });
    }
  }
  return saved;
}

async function seedDemoUser(titleIds: Map<string, string>) {
  const user = await db.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    create: { email: DEMO_USER_EMAIL, name: "Demo Learner", emailVerified: new Date() },
    update: {},
  });

  await db.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, status: "ACTIVE", plan: "premium", expiresAt: daysFromNow(23) },
    update: { status: "ACTIVE", expiresAt: daysFromNow(23) },
  });

  const watchLater = await db.list.upsert({
    where: { userId_systemKey: { userId: user.id, systemKey: "watch-later" } },
    create: { userId: user.id, name: "Watch later", systemKey: "watch-later" },
    update: {},
  });
  await db.list.upsert({
    where: { userId_systemKey: { userId: user.id, systemKey: "favorites" } },
    create: { userId: user.id, name: "Favorites", systemKey: "favorites" },
    update: {},
  });
  for (const slug of ["paper-cities", "the-quiet-frequency"]) {
    await db.listItem.upsert({
      where: { listId_titleId: { listId: watchLater.id, titleId: titleIds.get(slug)! } },
      create: { listId: watchLater.id, titleId: titleIds.get(slug)! },
      update: {},
    });
  }

  const movieId = titleIds.get("the-lighthouse-keepers-daughter")!;
  await db.watchProgress.upsert({
    where: { userId_titleId: { userId: user.id, titleId: movieId } },
    create: { userId: user.id, titleId: movieId, positionSeconds: 2580, durationSeconds: 6720 },
    update: { positionSeconds: 2580, durationSeconds: 6720 },
  });

  const seriesId = titleIds.get("harbour-lane")!;
  const episode = await db.episode.findFirst({
    where: { season: { titleId: seriesId, number: 1 }, number: 3 },
  });
  if (episode) {
    await db.watchProgress.upsert({
      where: { userId_titleId: { userId: user.id, titleId: seriesId } },
      create: {
        userId: user.id,
        titleId: seriesId,
        episodeId: episode.id,
        positionSeconds: 1200,
        durationSeconds: episode.durationSeconds,
      },
      update: { episodeId: episode.id, positionSeconds: 1200 },
    });
  }

  const words = [
    { word: "catch up", translation: "догнать", context: "I'll catch up with you." },
    { word: "let down", translation: "подвести", context: "Don't let us down this time!" },
    { word: "report", translation: "отчёт", context: "I have to finish this report first." },
  ];
  for (const entry of words) {
    await db.savedWord.upsert({
      where: { userId_word: { userId: user.id, word: entry.word } },
      create: { userId: user.id, titleId: movieId, ...entry },
      update: {},
    });
  }
}

async function main() {
  const genreIds = new Map<string, string>();
  for (const genre of GENRES) {
    const saved = await db.genre.upsert({
      where: { slug: genre.slug },
      create: genre,
      update: genre,
    });
    genreIds.set(genre.slug, saved.id);
  }

  const personIds = new Map<string, string>();
  for (const person of PEOPLE) {
    const saved = await db.person.upsert({
      where: { slug: person.slug },
      create: person,
      update: person,
    });
    personIds.set(person.slug, saved.id);
  }

  const titleIds = new Map<string, string>();
  for (const title of TITLES) {
    const saved = await seedTitle(title, genreIds, personIds);
    titleIds.set(title.slug, saved.id);
  }

  for (const [order, { titles, ...collection }] of COLLECTIONS.entries()) {
    const saved = await db.collection.upsert({
      where: { slug: collection.slug },
      create: { ...collection, order },
      update: { ...collection, order },
    });
    await db.collectionItem.deleteMany({ where: { collectionId: saved.id } });
    await db.collectionItem.createMany({
      data: titles.map((slug, index) => ({
        collectionId: saved.id,
        titleId: titleIds.get(slug)!,
        order: index,
      })),
    });
  }

  await seedDemoUser(titleIds);

  console.info(
    `Seeded ${GENRES.length} genres, ${PEOPLE.length} people, ${TITLES.length} titles, ${COLLECTIONS.length} collections.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
