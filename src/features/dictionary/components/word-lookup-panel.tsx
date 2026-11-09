"use client";

import { BookmarkCheck, BookmarkPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Skeleton } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useGetWordLookupQuery, useSaveWordMutation } from "../api/dictionary-api";
import { HighlightedContext } from "./highlighted-context";
import styles from "./word-lookup-panel.module.scss";

export interface WordLookupTarget {
  word: string;
  context: string;
  translationContext: string | null;
}

interface WordLookupPanelProps {
  target: WordLookupTarget;
  titleId: string;
  timestamp: number;
  isSignedIn: boolean;
  signInHref: string;
  onClose: () => void;
}

export function WordLookupPanel({
  target,
  titleId,
  timestamp,
  isSignedIn,
  signInHref,
  onClose,
}: WordLookupPanelProps) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: lookup, isFetching } = useGetWordLookupQuery(target.word);
  const [saveWord, { isLoading: isSaving, error: saveError }] = useSaveWordMutation();
  const [draftTranslation, setDraftTranslation] = useState<string | null>(null);
  const translation = draftTranslation ?? lookup?.translation ?? "";

  useEffect(() => {
    panelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (!lookup || !translation.trim()) return;
    void saveWord({
      word: lookup.word,
      translation: translation.trim(),
      context: target.context,
      titleId,
      timestamp: Math.floor(timestamp),
    });
  };

  const isSaved = Boolean(lookup?.savedWordId);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={t.dictionary.lookupTitle}
      tabIndex={-1}
      className={styles.root}
    >
      <header className={styles.header}>
        <p className={styles.word} lang="en">
          {lookup?.word ?? target.word}
        </p>
        <button
          type="button"
          className={styles.close}
          aria-label={t.dictionary.close}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
      </header>

      {isFetching && !lookup ? (
        <Skeleton height={40} />
      ) : (
        <label className={styles.field}>
          <span className={styles.label}>{t.dictionary.translation}</span>
          <input
            className={styles.input}
            value={translation}
            placeholder={t.dictionary.translationPlaceholder}
            onChange={(event) => setDraftTranslation(event.target.value)}
            maxLength={200}
          />
          {lookup && !lookup.translation && draftTranslation === null ? (
            <span className={styles.hint}>{t.dictionary.noTranslation}</span>
          ) : null}
        </label>
      )}

      <div className={styles.context}>
        <span className={styles.label}>{t.dictionary.context}</span>
        <p>
          <HighlightedContext text={target.context} word={target.word} lang="en" />
        </p>
        {target.translationContext ? (
          <p className={styles.muted}>{target.translationContext}</p>
        ) : null}
      </div>

      {saveError ? (
        <p role="alert" className={styles.error}>
          {"status" in saveError && saveError.status === 409
            ? t.dictionary.limitReached
            : t.dictionary.error}
        </p>
      ) : null}

      {isSignedIn ? (
        <Button
          onClick={handleSave}
          disabled={isSaving || !translation.trim() || !lookup}
          isFullWidth
          variant={isSaved ? "secondary" : "primary"}
        >
          {isSaved ? <BookmarkCheck aria-hidden="true" /> : <BookmarkPlus aria-hidden="true" />}
          {isSaving ? t.dictionary.saving : isSaved ? t.dictionary.saved : t.dictionary.save}
        </Button>
      ) : (
        <Button asChild variant="secondary" isFullWidth>
          <Link href={signInHref}>{t.dictionary.signInToSave}</Link>
        </Button>
      )}
    </div>
  );
}
