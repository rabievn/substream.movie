import { describe, expect, it } from "vitest";
import { applyReview, normalizeWord } from "./srs";

const now = new Date("2026-11-09T00:00:00Z");
const days = (date: Date) => Math.round((date.getTime() - now.getTime()) / 86_400_000);

describe("applyReview", () => {
  it("moves through the intervals", () => {
    expect(days(applyReview(true, 0, now).nextReviewAt)).toBe(1);
    expect(days(applyReview(true, 2, now).nextReviewAt)).toBe(7);
  });

  it("marks the word known after the last interval", () => {
    expect(applyReview(true, 5, now).status).toBe("KNOWN");
  });

  it("resets on a miss", () => {
    expect(applyReview(false, 4, now)).toMatchObject({ reviewCount: 0, status: "LEARNING" });
  });
});

describe("normalizeWord", () => {
  it("normalizes case, punctuation and apostrophes", () => {
    expect(normalizeWord(" Don’t, ")).toBe("don't");
    expect(normalizeWord("«Hello!»")).toBe("hello");
  });
});
