"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useReviewWordMutation } from "../api/dictionary-api";
import type { SavedWord } from "../types";
import { HighlightedContext } from "./highlighted-context";
import styles from "./review-session.module.scss";

interface ReviewSessionProps {
  /** Snapshot of due words, fixed for the session. */
  words: SavedWord[];
  onFinish: () => void;
}

export function ReviewSession({ words, onFinish }: ReviewSessionProps) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [reviewWord, { isLoading }] = useReviewWordMutation();
  const word = words[index];

  if (!word) {
    return (
      <div className={styles.card}>
        <p className={styles.done}>{t.dictionary.reviewDone}</p>
        <Button onClick={onFinish}>{t.dictionary.backToList}</Button>
      </div>
    );
  }

  const handleAnswer = async (isRemembered: boolean) => {
    await reviewWord({ id: word.id, isRemembered });
    setIsAnswerShown(false);
    setIndex((current) => current + 1);
  };

  return (
    <div className={styles.card} aria-live="polite">
      <p className={styles.progress}>
        {index + 1} / {words.length}
      </p>
      <p className={styles.word} lang="en">
        {word.word}
      </p>
      {word.context ? (
        <p className={styles.context}>
          <HighlightedContext text={word.context} word={word.word} lang="en" />
        </p>
      ) : null}
      {isAnswerShown ? (
        <>
          <p className={styles.translation}>{word.translation}</p>
          <div className={styles.actions}>
            <Button variant="outline" disabled={isLoading} onClick={() => handleAnswer(false)}>
              {t.dictionary.forgot}
            </Button>
            <Button disabled={isLoading} onClick={() => handleAnswer(true)}>
              {t.dictionary.remembered}
            </Button>
          </div>
        </>
      ) : (
        <Button variant="secondary" onClick={() => setIsAnswerShown(true)}>
          {t.dictionary.showAnswer}
        </Button>
      )}
      <button type="button" className={styles.exit} onClick={onFinish}>
        {t.dictionary.backToList}
      </button>
    </div>
  );
}
