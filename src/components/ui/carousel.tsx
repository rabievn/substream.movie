"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { IconButton } from "./icon-button";
import styles from "./carousel.module.scss";

export interface CarouselProps {
  /** Accessible name of the region, usually the section heading. */
  label: string;
  previousLabel: string;
  nextLabel: string;
  /** Item width preset. */
  itemSize?: "poster" | "wide" | "avatar";
  children: ReactNode;
}

/** Horizontal scroll-snap row. Swipe/scroll natively; arrow buttons on larger screens. */
export function Carousel({
  label,
  previousLabel,
  nextLabel,
  itemSize = "poster",
  children,
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  const handleScroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className={styles.root} role="region" aria-roledescription="carousel" aria-label={label}>
      <ul ref={trackRef} role="list" className={clsx(styles.track, styles[itemSize])}>
        {children}
      </ul>
      <div className={styles.controls}>
        <IconButton aria-label={previousLabel} size="sm" onClick={() => handleScroll(-1)}>
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={nextLabel} size="sm" onClick={() => handleScroll(1)}>
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}
