/**
 * Placeholder catalog. Every title, person and description here is invented
 * for development — no real films, actors or copyrighted text.
 */
import type { CefrLevel, Language, TitleType } from "../src/generated/prisma/enums";

export const SAMPLE_VIDEO_URL = "/media/sample.mp4";
export const SAMPLE_SUBTITLES = {
  en: "/media/subtitles/sample-en.vtt",
  ru: "/media/subtitles/sample-ru.vtt",
} as const;

export const GENRES = [
  { slug: "drama", name: "Drama", nameRu: "Драма" },
  { slug: "comedy", name: "Comedy", nameRu: "Комедия" },
  { slug: "adventure", name: "Adventure", nameRu: "Приключения" },
  { slug: "sci-fi", name: "Sci-Fi", nameRu: "Фантастика" },
  { slug: "thriller", name: "Thriller", nameRu: "Триллер" },
  { slug: "family", name: "Family", nameRu: "Семейный" },
  { slug: "animation", name: "Animation", nameRu: "Мультфильм" },
  { slug: "romance", name: "Romance", nameRu: "Мелодрама" },
  { slug: "mystery", name: "Mystery", nameRu: "Детектив" },
  { slug: "documentary", name: "Documentary", nameRu: "Документальный" },
] as const;

export const PEOPLE = [
  { slug: "ava-lindqvist", name: "Ava Lindqvist", popularity: 95 },
  { slug: "marcus-oyelaran", name: "Marcus Oyelaran", popularity: 90 },
  { slug: "june-hartley", name: "June Hartley", popularity: 86 },
  { slug: "tomas-brennan", name: "Tomás Brennan", popularity: 80 },
  { slug: "priya-castellano", name: "Priya Castellano", popularity: 78 },
  { slug: "elliot-vance", name: "Elliot Vance", popularity: 74 },
  { slug: "noor-haddad", name: "Noor Haddad", popularity: 70 },
  { slug: "felix-ashworth", name: "Felix Ashworth", popularity: 66 },
  { slug: "lena-moreau", name: "Lena Moreau", popularity: 61 },
  { slug: "owen-kowalski", name: "Owen Kowalski", popularity: 57 },
  { slug: "sofia-reyes-park", name: "Sofia Reyes-Park", popularity: 52 },
  { slug: "dmitri-hale", name: "Dmitri Hale", popularity: 48 },
] as const;

type PersonSlug = (typeof PEOPLE)[number]["slug"];
type GenreSlug = (typeof GENRES)[number]["slug"];

export interface SeedTitle {
  slug: string;
  type: TitleType;
  originalTitle: string;
  localizedTitle: string;
  tagline: string;
  description: string;
  descriptionRu: string;
  year: number;
  durationMinutes: number;
  cefrLevel: CefrLevel;
  language?: Language;
  countries: string[];
  ageRating: string;
  imdbRating: number | null;
  otherRating: number | null;
  popularity: number;
  isFeatured?: boolean;
  /** Days from now; positive ⇒ upcoming (no video yet) */
  releaseInDays?: number;
  /** Days ago the title was added to the site */
  addedDaysAgo: number;
  genres: GenreSlug[];
  cast: { person: PersonSlug; character: string }[];
  director: PersonSlug;
  /** Series/cartoon series: episodes per season */
  seasons?: number[];
}

const M = "MOVIE" as const;
const S = "SERIES" as const;
const C = "CARTOON" as const;

export const TITLES: SeedTitle[] = [
  {
    slug: "the-lighthouse-keepers-daughter",
    type: M,
    originalTitle: "The Lighthouse Keeper's Daughter",
    localizedTitle: "Дочь смотрителя маяка",
    tagline: "Some storms you have to sail into.",
    description:
      "A young engineer returns to the remote island where she grew up to automate her late father's lighthouse — and finds a logbook that rewrites her family's history.",
    descriptionRu:
      "Молодой инженер возвращается на остров детства, чтобы автоматизировать маяк покойного отца, и находит журнал, который меняет историю её семьи.",
    year: 2023,
    durationMinutes: 112,
    cefrLevel: "B1",
    countries: ["GB", "IE"],
    ageRating: "12+",
    imdbRating: 7.6,
    otherRating: 7.9,
    popularity: 980,
    isFeatured: true,
    addedDaysAgo: 3,
    genres: ["drama", "mystery"],
    cast: [
      { person: "ava-lindqvist", character: "Maren Ross" },
      { person: "tomas-brennan", character: "Callum Ross" },
      { person: "noor-haddad", character: "Inspector Shaw" },
    ],
    director: "dmitri-hale",
  },
  {
    slug: "orbit-of-small-things",
    type: M,
    originalTitle: "Orbit of Small Things",
    localizedTitle: "Орбита мелочей",
    tagline: "Houston, we have a roommate.",
    description:
      "Two astronauts who can't stand each other must share a tiny research module for six months. A gentle comedy about patience, plants and very bad jokes.",
    descriptionRu:
      "Два астронавта, которые терпеть не могут друг друга, полгода делят крошечный модуль. Добрая комедия о терпении, растениях и очень плохих шутках.",
    year: 2024,
    durationMinutes: 98,
    cefrLevel: "A2",
    countries: ["US"],
    ageRating: "6+",
    imdbRating: 7.1,
    otherRating: 7.4,
    popularity: 870,
    addedDaysAgo: 6,
    genres: ["comedy", "sci-fi"],
    cast: [
      { person: "marcus-oyelaran", character: "Cmdr. Lewis Grant" },
      { person: "june-hartley", character: "Dr. Robin Kale" },
    ],
    director: "felix-ashworth",
  },
  {
    slug: "paper-cities",
    type: M,
    originalTitle: "Paper Cities",
    localizedTitle: "Бумажные города",
    tagline: "Every map hides a mistake.",
    description:
      "A cartographer discovers a town on an old map that doesn't exist — until she drives there.",
    descriptionRu:
      "Картограф находит на старой карте город, которого не существует — пока она туда не приезжает.",
    year: 2022,
    durationMinutes: 104,
    cefrLevel: "B2",
    countries: ["US", "CA"],
    ageRating: "16+",
    imdbRating: 7.3,
    otherRating: 7.0,
    popularity: 760,
    addedDaysAgo: 20,
    genres: ["mystery", "thriller"],
    cast: [
      { person: "priya-castellano", character: "Hannah Price" },
      { person: "elliot-vance", character: "Sheriff Doyle" },
    ],
    director: "dmitri-hale",
  },
  {
    slug: "sunday-bakers",
    type: M,
    originalTitle: "Sunday Bakers",
    localizedTitle: "Воскресные пекари",
    tagline: "Life is better with butter.",
    description:
      "A retired teacher opens a weekend bakery class and accidentally brings a whole neighbourhood together.",
    descriptionRu:
      "Учительница на пенсии открывает курсы выпечки по выходным и случайно объединяет целый район.",
    year: 2021,
    durationMinutes: 95,
    cefrLevel: "A2",
    countries: ["GB"],
    ageRating: "0+",
    imdbRating: 6.9,
    otherRating: 7.2,
    popularity: 540,
    addedDaysAgo: 40,
    genres: ["comedy", "family"],
    cast: [
      { person: "lena-moreau", character: "Margaret Bell" },
      { person: "owen-kowalski", character: "Sam" },
    ],
    director: "felix-ashworth",
  },
  {
    slug: "the-quiet-frequency",
    type: M,
    originalTitle: "The Quiet Frequency",
    localizedTitle: "Тихая частота",
    tagline: "Someone is listening.",
    description:
      "A late-night radio host receives calls from a listener who knows things that haven't happened yet.",
    descriptionRu:
      "Ведущий ночного радио получает звонки от слушателя, который знает о том, что ещё не произошло.",
    year: 2020,
    durationMinutes: 118,
    cefrLevel: "C1",
    countries: ["US"],
    ageRating: "16+",
    imdbRating: 7.8,
    otherRating: 7.5,
    popularity: 690,
    addedDaysAgo: 75,
    genres: ["thriller", "sci-fi"],
    cast: [
      { person: "marcus-oyelaran", character: "Jonah Wells" },
      { person: "sofia-reyes-park", character: "Caller" },
    ],
    director: "elliot-vance",
  },
  {
    slug: "letters-to-november",
    type: M,
    originalTitle: "Letters to November",
    localizedTitle: "Письма в ноябрь",
    tagline: "Some letters arrive right on time.",
    description:
      "Two strangers start writing letters after a postal mix-up — and slowly realise they live on the same street.",
    descriptionRu:
      "После ошибки почты двое незнакомцев начинают переписываться и понимают, что живут на одной улице.",
    year: 2019,
    durationMinutes: 101,
    cefrLevel: "B1",
    countries: ["CA"],
    ageRating: "12+",
    imdbRating: 7.0,
    otherRating: 7.6,
    popularity: 610,
    addedDaysAgo: 110,
    genres: ["romance", "drama"],
    cast: [
      { person: "june-hartley", character: "Clara" },
      { person: "tomas-brennan", character: "Ben" },
    ],
    director: "lena-moreau",
  },
  {
    slug: "harbour-lane",
    type: S,
    originalTitle: "Harbour Lane",
    localizedTitle: "Харбор-лейн",
    tagline: "Small town. Big secrets.",
    description:
      "Neighbours on a quiet seaside street get tangled in each other's lives after a mysterious package arrives.",
    descriptionRu:
      "Жители тихой приморской улицы оказываются втянуты в жизни друг друга после таинственной посылки.",
    year: 2022,
    durationMinutes: 45,
    cefrLevel: "B1",
    countries: ["GB"],
    ageRating: "12+",
    imdbRating: 8.1,
    otherRating: 8.0,
    popularity: 950,
    addedDaysAgo: 2,
    genres: ["drama", "mystery"],
    cast: [
      { person: "ava-lindqvist", character: "Grace Holloway" },
      { person: "owen-kowalski", character: "Danny Price" },
      { person: "noor-haddad", character: "Leila Amin" },
    ],
    director: "lena-moreau",
    seasons: [6, 6],
  },
  {
    slug: "startup-garage",
    type: S,
    originalTitle: "Startup Garage",
    localizedTitle: "Стартап в гараже",
    tagline: "Move fast and fix things.",
    description:
      "Four friends try to launch an app from a garage with no money, one laptop and too many opinions.",
    descriptionRu:
      "Четверо друзей пытаются запустить приложение из гаража — без денег, с одним ноутбуком и кучей мнений.",
    year: 2023,
    durationMinutes: 28,
    cefrLevel: "B2",
    countries: ["US"],
    ageRating: "16+",
    imdbRating: 7.9,
    otherRating: 7.7,
    popularity: 890,
    addedDaysAgo: 9,
    genres: ["comedy"],
    cast: [
      { person: "marcus-oyelaran", character: "Dev" },
      { person: "priya-castellano", character: "Asha" },
      { person: "felix-ashworth", character: "Tyler" },
    ],
    director: "elliot-vance",
    seasons: [8],
  },
  {
    slug: "the-night-shift-files",
    type: S,
    originalTitle: "The Night Shift Files",
    localizedTitle: "Дела ночной смены",
    tagline: "Every case starts after midnight.",
    description: "A rookie detective works only night shifts — and only the strangest cases.",
    descriptionRu:
      "Детектив-новичок работает только в ночную смену — и только над самыми странными делами.",
    year: 2021,
    durationMinutes: 52,
    cefrLevel: "C1",
    countries: ["US"],
    ageRating: "18+",
    imdbRating: 8.3,
    otherRating: 8.1,
    popularity: 820,
    addedDaysAgo: 30,
    genres: ["thriller", "mystery"],
    cast: [
      { person: "sofia-reyes-park", character: "Det. Mara Quinn" },
      { person: "dmitri-hale", character: "Capt. Ross" },
    ],
    director: "dmitri-hale",
    seasons: [10, 10, 8],
  },
  {
    slug: "weeknight-kitchen",
    type: S,
    originalTitle: "Weeknight Kitchen",
    localizedTitle: "Кухня по будням",
    tagline: "Dinner in thirty minutes. Drama in five.",
    description:
      "A cooking show host juggles live TV, a chaotic family and a rival chef next door.",
    descriptionRu:
      "Ведущая кулинарного шоу совмещает прямой эфир, шумную семью и соседа-конкурента.",
    year: 2024,
    durationMinutes: 24,
    cefrLevel: "A2",
    countries: ["AU"],
    ageRating: "6+",
    imdbRating: 7.2,
    otherRating: 7.3,
    popularity: 650,
    addedDaysAgo: 14,
    genres: ["comedy", "family"],
    cast: [
      { person: "lena-moreau", character: "Kate" },
      { person: "tomas-brennan", character: "Chef Marco" },
    ],
    director: "felix-ashworth",
    seasons: [10],
  },
  {
    slug: "pip-and-the-cloud-garden",
    type: C,
    originalTitle: "Pip and the Cloud Garden",
    localizedTitle: "Пип и облачный сад",
    tagline: "Grow something wonderful.",
    description:
      "A small robot plants a garden in the clouds and learns the names of every flower.",
    descriptionRu: "Маленький робот сажает сад в облаках и узнаёт названия всех цветов.",
    year: 2023,
    durationMinutes: 80,
    cefrLevel: "A1",
    countries: ["US"],
    ageRating: "0+",
    imdbRating: 7.4,
    otherRating: 7.8,
    popularity: 720,
    addedDaysAgo: 5,
    genres: ["animation", "family", "adventure"],
    cast: [
      { person: "june-hartley", character: "Pip (voice)" },
      { person: "owen-kowalski", character: "Nimbus (voice)" },
    ],
    director: "lena-moreau",
  },
  {
    slug: "forest-school",
    type: C,
    originalTitle: "Forest School",
    localizedTitle: "Лесная школа",
    tagline: "Learning is an adventure.",
    description:
      "Woodland animals go to school and learn colours, numbers and how to be good friends.",
    descriptionRu: "Лесные звери ходят в школу и учат цвета, числа и как быть хорошими друзьями.",
    year: 2022,
    durationMinutes: 11,
    cefrLevel: "A1",
    countries: ["GB"],
    ageRating: "0+",
    imdbRating: 7.0,
    otherRating: 7.5,
    popularity: 600,
    addedDaysAgo: 50,
    genres: ["animation", "family"],
    cast: [{ person: "noor-haddad", character: "Teacher Owl (voice)" }],
    director: "felix-ashworth",
    seasons: [12],
  },
  {
    slug: "the-great-balloon-race",
    type: C,
    originalTitle: "The Great Balloon Race",
    localizedTitle: "Великая гонка на шарах",
    tagline: "Up, up and around the world.",
    description: "A brave mouse enters a round-the-world balloon race with a homemade balloon.",
    descriptionRu: "Отважная мышка участвует в кругосветной гонке на самодельном воздушном шаре.",
    year: 2020,
    durationMinutes: 86,
    cefrLevel: "A2",
    countries: ["FR"],
    ageRating: "0+",
    imdbRating: 6.8,
    otherRating: 7.1,
    popularity: 480,
    addedDaysAgo: 90,
    genres: ["animation", "adventure"],
    cast: [{ person: "felix-ashworth", character: "Basil (voice)" }],
    director: "elliot-vance",
  },
  // Upcoming
  {
    slug: "northbound",
    type: M,
    originalTitle: "Northbound",
    localizedTitle: "На север",
    tagline: "The road is the destination.",
    description:
      "Three siblings drive their grandmother's old van to the Arctic Circle to keep a promise.",
    descriptionRu:
      "Трое детей едут на старом фургоне бабушки за Полярный круг, чтобы сдержать обещание.",
    year: 2027,
    durationMinutes: 109,
    cefrLevel: "B1",
    countries: ["NO", "GB"],
    ageRating: "12+",
    imdbRating: null,
    otherRating: null,
    popularity: 400,
    releaseInDays: 18,
    addedDaysAgo: 1,
    genres: ["adventure", "drama"],
    cast: [{ person: "ava-lindqvist", character: "Ingrid" }],
    director: "dmitri-hale",
  },
  {
    slug: "signal-lost",
    type: S,
    originalTitle: "Signal Lost",
    localizedTitle: "Сигнал потерян",
    tagline: "No network. No way back.",
    description:
      "A group of hikers loses contact with the world — and the world loses contact with them.",
    descriptionRu: "Группа туристов теряет связь с миром — и мир теряет связь с ними.",
    year: 2027,
    durationMinutes: 50,
    cefrLevel: "B2",
    countries: ["CA"],
    ageRating: "16+",
    imdbRating: null,
    otherRating: null,
    popularity: 380,
    releaseInDays: 42,
    addedDaysAgo: 1,
    genres: ["thriller", "sci-fi"],
    cast: [{ person: "marcus-oyelaran", character: "Eli" }],
    director: "elliot-vance",
    seasons: [8],
  },
];

export const COLLECTIONS = [
  {
    slug: "best-for-english",
    name: "Best for learning English",
    nameRu: "Лучшее для изучения английского",
    description: "Clear speech, everyday vocabulary and great stories.",
    descriptionRu: "Чёткая речь, повседневная лексика и отличные истории.",
    titles: ["orbit-of-small-things", "sunday-bakers", "harbour-lane", "letters-to-november"],
  },
  {
    slug: "english-for-kids",
    name: "English for kids",
    nameRu: "Английский для детей",
    description: "Simple language, bright characters.",
    descriptionRu: "Простой язык и яркие персонажи.",
    titles: ["pip-and-the-cloud-garden", "forest-school", "the-great-balloon-race"],
  },
  {
    slug: "advanced-level",
    name: "For advanced learners",
    nameRu: "Для продвинутых",
    description: "Fast dialogue, idioms and slang.",
    descriptionRu: "Быстрые диалоги, идиомы и сленг.",
    titles: ["the-quiet-frequency", "the-night-shift-files", "startup-garage", "paper-cities"],
  },
  {
    slug: "cozy-evening",
    name: "Cozy evening",
    nameRu: "Уютный вечер",
    description: "Warm, low-stress stories.",
    descriptionRu: "Тёплые и спокойные истории.",
    titles: ["sunday-bakers", "letters-to-november", "weeknight-kitchen"],
  },
] as const;
