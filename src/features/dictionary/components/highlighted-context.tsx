import { Fragment } from "react";
import { normalizeWord } from "../lib/srs";

/** Renders a subtitle line with occurrences of `word` wrapped in <mark>. */
export function HighlightedContext({
  text,
  word,
  lang,
}: {
  text: string;
  word: string;
  lang?: string;
}) {
  const target = normalizeWord(word);
  const parts = text.split(/([\p{L}\p{N}'’-]+)/u);
  return (
    <span lang={lang}>
      {parts.map((part, index) =>
        normalizeWord(part) === target ? (
          <mark key={index}>{part}</mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </span>
  );
}
