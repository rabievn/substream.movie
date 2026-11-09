"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  Badge,
  Button,
  IconButton,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TextField,
} from "@/components/ui";
import { format } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useDeleteWordMutation, useGetSavedWordsQuery } from "../api/dictionary-api";
import type { WordStatus } from "../lib/srs";
import type { SavedWord } from "../types";
import styles from "./dictionary-view.module.scss";
import { ReviewSession } from "./review-session";

type StatusFilter = "ALL" | WordStatus;
const FILTERS: StatusFilter[] = ["ALL", "NEW", "LEARNING", "KNOWN"];
const BADGE = { NEW: "secondary", LEARNING: "levelB", KNOWN: "levelA" } as const;

export function DictionaryView() {
  const { t } = useI18n();
  const { data: words, isLoading, isError } = useGetSavedWordsQuery();
  const [deleteWord] = useDeleteWordMutation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const [reviewWords, setReviewWords] = useState<SavedWord[] | null>(null);

  const dueWords = useMemo(() => (words ?? []).filter((word) => word.isDue), [words]);

  const visibleWords = useMemo(
    () =>
      (words ?? []).filter(
        (word) =>
          (statusFilter === "ALL" || word.status === statusFilter) &&
          (!deferredSearch ||
            word.word.includes(deferredSearch) ||
            word.translation.toLowerCase().includes(deferredSearch)),
      ),
    [words, statusFilter, deferredSearch],
  );

  if (reviewWords)
    return <ReviewSession words={reviewWords} onFinish={() => setReviewWords(null)} />;

  if (isLoading) return <Skeleton height={240} radius="lg" />;
  if (isError) return <p role="alert">{t.dictionary.error}</p>;

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(FILTERS.find((f) => f === value) ?? "ALL")}
        >
          <TabsList aria-label={t.dictionary.title} className={styles.tabs}>
            {FILTERS.map((filter) => (
              <TabsTrigger key={filter} value={filter}>
                {filter === "ALL" ? t.dictionary.all : t.dictionary[`status${filter}`]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button onClick={() => setReviewWords(dueWords)} disabled={dueWords.length === 0}>
          {dueWords.length
            ? format(t.dictionary.review, { count: dueWords.length })
            : t.dictionary.nothingToReview}
        </Button>
      </div>
      <TextField
        label={t.dictionary.search}
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={styles.search}
      />

      {visibleWords.length === 0 ? (
        <p className={styles.empty}>{t.dictionary.empty}</p>
      ) : (
        <ul role="list" className={styles.list}>
          {visibleWords.map((word) => (
            <li key={word.id} className={styles.item}>
              <div className={styles.text}>
                <p className={styles.word}>
                  <span lang="en">{word.word}</span> — {word.translation}
                </p>
                {word.context ? (
                  <p className={styles.context} lang="en">
                    {word.context}
                  </p>
                ) : null}
                {word.title ? (
                  <Link href={`/title/${word.title.slug}`} className={styles.source}>
                    {format(t.dictionary.from, { title: word.title.originalTitle })}
                  </Link>
                ) : null}
              </div>
              <Badge variant={BADGE[word.status]}>{t.dictionary[`status${word.status}`]}</Badge>
              <IconButton
                aria-label={`${t.dictionary.delete}: ${word.word}`}
                size="sm"
                onClick={() => deleteWord(word.id)}
              >
                <Trash2 aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
