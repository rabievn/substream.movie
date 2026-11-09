import type { SubtitleCue } from "../types";

const TIMESTAMP = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})[.,](\d{1,3})/;
const TIMING_LINE = new RegExp(`${TIMESTAMP.source}\\s*-->\\s*${TIMESTAMP.source}`);

const toSeconds = (hours = "0", minutes = "0", seconds = "0", fraction = "0") =>
  Number(hours) * 3600 +
  Number(minutes) * 60 +
  Number(seconds) +
  Number(fraction.padEnd(3, "0")) / 1000;

/** Removes formatting tags (<i>, <b>, <c.color>, {\an8}) and decodes basic entities. */
const cleanText = (text: string) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/\{\\[^}]+\}/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();

/** Parses WebVTT or SRT into cues sorted by start time. Malformed blocks are skipped. */
export function parseSubtitles(source: string): SubtitleCue[] {
  const blocks = source
    .replace(/^﻿/, "")
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/);

  const cues: SubtitleCue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => TIMING_LINE.test(line));
    if (timingIndex === -1) continue;

    const match = lines[timingIndex]!.match(TIMING_LINE);
    if (!match) continue;
    const [, h1, m1, s1, f1, h2, m2, s2, f2] = match;
    const start = toSeconds(h1, m1, s1, f1);
    const end = toSeconds(h2, m2, s2, f2);
    const text = cleanText(lines.slice(timingIndex + 1).join("\n"));
    if (!text || end <= start) continue;

    cues.push({ id: cues.length, start, end, text });
  }

  return cues.sort((a, b) => a.start - b.start).map((cue, index) => ({ ...cue, id: index }));
}

/** Index of the cue visible at `time`, or -1. Binary search: cues are sorted by start. */
export function findCueIndex(cues: readonly SubtitleCue[], time: number): number {
  let low = 0;
  let high = cues.length - 1;
  let candidate = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (cues[middle]!.start <= time) {
      candidate = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return candidate !== -1 && time < cues[candidate]!.end ? candidate : -1;
}

/** Index of the last cue that started at or before `time` (for "replay previous line"). */
export function findPreviousCueIndex(cues: readonly SubtitleCue[], time: number): number {
  let index = -1;
  for (let i = 0; i < cues.length && cues[i]!.start <= time; i += 1) index = i;
  return index;
}

/** Splits a line into word and non-word tokens, keeping punctuation/spaces for rendering. */
export function tokenizeLine(text: string): { value: string; isWord: boolean }[] {
  return (text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*|[^\p{L}\p{N}]+/gu) ?? []).map(
    (value) => ({
      value,
      isWord: /[\p{L}\p{N}]/u.test(value),
    }),
  );
}
