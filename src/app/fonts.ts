import localFont from "next/font/local";

// Manrope (SIL Open Font License), self-hosted so builds never depend on the network.
// Latin and Cyrillic are separate faces; the font stack falls back per glyph.
export const manropeLatin = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope-latin",
  display: "swap",
});

export const manropeCyrillic = localFont({
  src: "./fonts/manrope-cyrillic-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope-cyrillic",
  display: "swap",
  preload: false,
});
