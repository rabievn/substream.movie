import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./title-poster.module.scss";

interface TitlePosterProps {
  title: string;
  posterUrl: string | null;
  /** Used to pick a stable placeholder palette. */
  seed: string;
  sizes?: string;
  isPriority?: boolean;
  className?: string;
}

const PLACEHOLDER_HUES = [12, 28, 168, 198, 222, 262, 320, 340];

const hashString = (value: string) =>
  [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);

/** Poster image, or an original generated placeholder when no artwork exists. */
export function TitlePoster({
  title,
  posterUrl,
  seed,
  sizes = "(min-width: 1024px) 200px, 45vw",
  isPriority = false,
  className,
}: TitlePosterProps) {
  if (posterUrl) {
    return (
      <div className={clsx(styles.root, className)}>
        <Image
          src={posterUrl}
          alt=""
          fill
          sizes={sizes}
          priority={isPriority}
          className={styles.image}
        />
      </div>
    );
  }

  const hash = hashString(seed);
  const hue = PLACEHOLDER_HUES[hash % PLACEHOLDER_HUES.length] ?? 200;
  const angle = hash % 360;

  return (
    <div
      className={clsx(styles.root, styles.placeholder, className)}
      style={{ "--poster-hue": hue, "--poster-angle": `${angle}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.placeholderTitle}>{title}</span>
    </div>
  );
}
