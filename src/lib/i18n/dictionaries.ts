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
  auth: {
    signInTitle: "Sign in",
    signInSubtitle: "We'll email you a magic link — no password needed.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    sendLink: "Send sign-in link",
    sending: "Sending…",
    orDivider: "or",
    continueWithGoogle: "Continue with Google",
    invalidEmail: "Enter a valid email address.",
    failed: "Couldn't send the link. Please try again.",
    checkEmailTitle: "Check your email",
    checkEmailText: "We sent a sign-in link. Open it on this device to continue.",
    signOut: "Sign out",
    account: "Account",
  },
  account: {
    navLabel: "Account navigation",
    profile: "Profile",
    dictionary: "Dictionary",
    lists: "My lists",
    requests: "Title requests",
    subscription: "Subscription",
    help: "Help & FAQ",
  },
  profile: {
    title: "Profile",
    nameLabel: "Display name",
    nameTooLong: "Name must be 60 characters or fewer.",
    localeLabel: "Interface language",
    save: "Save changes",
    saving: "Saving…",
    saved: "Saved",
    saveFailed: "Couldn't save. Please try again.",
    subscription: "Subscription",
    daysLeft: "{count} days left",
    expired: "Expired",
    plan: "Plan",
    statusTrial: "Trial",
    statusActive: "Active",
    statusExpired: "Expired",
    statusCanceled: "Canceled",
    stats: "Your progress",
    savedWords: "Saved words",
    titlesStarted: "Titles started",
    memberSince: "Member since",
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
  auth: {
    signInTitle: "Вход",
    signInSubtitle: "Мы отправим ссылку для входа на почту — без пароля.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    sendLink: "Отправить ссылку",
    sending: "Отправляем…",
    orDivider: "или",
    continueWithGoogle: "Войти через Google",
    invalidEmail: "Введите корректный email.",
    failed: "Не удалось отправить ссылку. Попробуйте ещё раз.",
    checkEmailTitle: "Проверьте почту",
    checkEmailText: "Мы отправили ссылку для входа. Откройте её на этом устройстве.",
    signOut: "Выйти",
    account: "Аккаунт",
  },
  account: {
    navLabel: "Навигация по аккаунту",
    profile: "Профиль",
    dictionary: "Словарь",
    lists: "Мои списки",
    requests: "Заявки на фильмы",
    subscription: "Подписка",
    help: "Помощь и FAQ",
  },
  profile: {
    title: "Профиль",
    nameLabel: "Имя",
    nameTooLong: "Имя должно быть не длиннее 60 символов.",
    localeLabel: "Язык интерфейса",
    save: "Сохранить",
    saving: "Сохраняем…",
    saved: "Сохранено",
    saveFailed: "Не удалось сохранить. Попробуйте ещё раз.",
    subscription: "Подписка",
    daysLeft: "Осталось дней: {count}",
    expired: "Истекла",
    plan: "Тариф",
    statusTrial: "Пробный период",
    statusActive: "Активна",
    statusExpired: "Истекла",
    statusCanceled: "Отменена",
    stats: "Ваш прогресс",
    savedWords: "Сохранённых слов",
    titlesStarted: "Начато просмотров",
    memberSince: "С нами с",
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

/** Replaces `{name}` placeholders: format("{count} days", { count: 3 }) */
export const format = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
