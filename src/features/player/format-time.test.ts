import { describe, expect, it } from "vitest";
import { formatTime } from "./format-time";

describe("formatTime", () => {
  it.each([
    [0, "0:00"],
    [75.9, "1:15"],
    [3725, "1:02:05"],
    [-4, "0:00"],
    [Number.NaN, "0:00"],
  ])("%s → %s", (input, expected) => {
    expect(formatTime(input)).toBe(expected);
  });
});
