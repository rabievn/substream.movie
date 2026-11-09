// Client-safe exports. Server code imports getLocale/getDictionary from "./get-locale".
export {
  dictionaries,
  format,
  isLocale,
  LOCALES,
  LOCALE_COOKIE,
  DEFAULT_LOCALE,
  type Dictionary,
  type Locale,
} from "./dictionaries";
