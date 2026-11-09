import { describe, expect, it } from "vitest";
import { isFinished, updateWatchProgressSchema } from "./watch-progress-schema";

describe("updateWatchProgressSchema", () => {
  it("accepts a valid payload", () => {
    expect(
      updateWatchProgressSchema.safeParse({
        titleId: "t1",
        positionSeconds: 10,
        durationSeconds: 100,
      }).success,
    ).toBe(true);
  });

  it("rejects a position past the end", () => {
    expect(
      updateWatchProgressSchema.safeParse({
        titleId: "t1",
        positionSeconds: 200,
        durationSeconds: 100,
      }).success,
    ).toBe(false);
  });
});

describe("isFinished", () => {
  it("uses the 95% threshold", () => {
    expect(isFinished(94, 100)).toBe(false);
    expect(isFinished(95, 100)).toBe(true);
    expect(isFinished(0, 0)).toBe(false);
  });
});
