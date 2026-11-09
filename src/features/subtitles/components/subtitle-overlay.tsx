"use client";

import clsx from "clsx";
import { Fragment } from "react";
import { useAppSelector } from "@/store/hooks";
import { findCueIndex, tokenizeLine } from "../lib/parse-subtitles";
import { selectSubtitleSettings } from "../model/subtitle-settings-selectors";
import type { SubtitleCue } from "../types";
import styles from "./subtitle-overlay.module.scss";

export interface WordClickPayload {
  word: string;
  /** Full subtitle line the word came from */
  context: string;
  /** Translation line shown at the same time, if any */
  translationContext: string | null;
  /** Element to anchor a popover to */
  anchor: HTMLElement;
}

interface SubtitleOverlayProps {
  originalCues: readonly SubtitleCue[];
  translationCues: readonly SubtitleCue[];
  currentTime: number;
  originalLanguage: string;
  translationLanguage: string;
  onWordClick?: (payload: WordClickPayload) => void;
}

export function SubtitleOverlay({
  originalCues,
  translationCues,
  currentTime,
  originalLanguage,
  translationLanguage,
  onWordClick,
}: SubtitleOverlayProps) {
  const settings = useAppSelector(selectSubtitleSettings);
  const originalCue = originalCues[findCueIndex(originalCues, currentTime)];
  const translationCue = translationCues[findCueIndex(translationCues, currentTime)];

  const showOriginal = settings.isOriginalVisible && originalCue;
  const showTranslation = settings.isTranslationVisible && translationCue;
  if (!showOriginal && !showTranslation) return null;

  return (
    <div className={clsx(styles.root, styles[settings.fontSize])}>
      {showOriginal ? (
        <p className={styles.original} lang={originalLanguage}>
          {tokenizeLine(originalCue.text).map((token, index) =>
            token.isWord ? (
              <button
                key={index}
                type="button"
                className={styles.word}
                onClick={(event) =>
                  onWordClick?.({
                    word: token.value,
                    context: originalCue.text,
                    translationContext: translationCue?.text ?? null,
                    anchor: event.currentTarget,
                  })
                }
              >
                {token.value}
              </button>
            ) : (
              <Fragment key={index}>{token.value}</Fragment>
            ),
          )}
        </p>
      ) : null}
      {showTranslation ? (
        <p className={styles.translation} lang={translationLanguage}>
          {translationCue.text}
        </p>
      ) : null}
    </div>
  );
}
