import { describe, expect, it } from "vitest";
import { getDaysLeft } from "./subscription";

const now = new Date("2026-11-09T12:00:00Z");

describe("getDaysLeft", () => {
  it("rounds partial days up", () => {
    expect(getDaysLeft(new Date("2026-11-10T00:00:00Z"), now)).toBe(1);
  });

  it("counts whole days", () => {
    expect(getDaysLeft(new Date("2026-11-16T12:00:00Z"), now)).toBe(7);
  });

  it("never returns a negative number", () => {
    expect(getDaysLeft(new Date("2026-11-01T00:00:00Z"), now)).toBe(0);
  });
});
