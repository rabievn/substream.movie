/**
 * All UI strings in one place. `en` is the source of truth for keys;
 * `ru` must satisfy the same shape (enforced by the `Dictionary` type).
 */
const en = {
  nav: {
    home: "Home",
    movies: "Movies",
    series: "Series",
    cartoons: "Cartoons",
    collections: "Collections",
    search: "Search",
    dictionary: "Dictionary",
    profile: "Profile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNavigation: "Main navigation",
  },
  theme: {
    toggle: "Toggle color theme",
    light: "Light",
    dark: "Dark",
  },
  locale: {
    label: "Interface language",
    en: "English",
    ru: "Русский",
  },
  footer: {
    tagline: "Learn English with films and series, one subtitle at a time.",
    help: "Help & FAQ",
    requests: "Request a title",
    subscription: "Subscription",
    rights: "All rights reserved.",
  },
  common: {
    skipToContent: "Skip to content",
    loading: "Loading…",
    errorTitle: "Something went wrong",
    retry: "Try again",
    notFound: "Page not found",
    backHome: "Back to home",
    signIn: "Sign in",
  },
  home: {
    title: "Learn English by watching what you love",
    subtitle: "Dual subtitles, one-click translations and a personal dictionary.",
  },
} as const;

type DeepStringify<T> = { [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]> };
export type Dictionary = DeepStringify<typeof en>;

const ru: Dictionary = {
  nav: {
    home: "Главная",
    movies: "Фильмы",
    series: "Сериалы",
    cartoons: "Мультфильмы",
    collections: "Подборки",
    search: "Поиск",
    dictionary: "Словарь",
    profile: "Профиль",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    mainNavigation: "Основная навигация",
  },
  theme: {
    toggle: "Переключить тему",
    light: "Светлая",
    dark: "Тёмная",
  },
  locale: {
    label: "Язык интерфейса",
    en: "English",
    ru: "Русский",
  },
  footer: {
    tagline: "Учите английский по фильмам и сериалам — субтитр за субтитром.",
    help: "Помощь и FAQ",
    requests: "Запросить фильм",
    subscription: "Подписка",
    rights: "Все права защищены.",
  },
  common: {
    skipToContent: "Перейти к содержимому",
    loading: "Загрузка…",
    errorTitle: "Что-то пошло не так",
    retry: "Попробовать снова",
    notFound: "Страница не найдена",
    backHome: "На главную",
    signIn: "Войти",
  },
  home: {
    title: "Учите английский, смотря то, что любите",
    subtitle: "Двойные субтитры, перевод в один клик и личный словарь.",
  },
};

export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "locale";

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);
