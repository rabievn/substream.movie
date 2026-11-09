import { describe, expect, it } from "vitest";
import { titleRequestSchema } from "./title-request-schema";

describe("titleRequestSchema", () => {
  it("treats an empty year as null", () => {
    expect(titleRequestSchema.parse({ name: " Some Film ", year: "", comment: "" })).toEqual({
      name: "Some Film",
      year: null,
      comment: "",
    });
  });

  it("coerces a numeric year and rejects nonsense", () => {
    expect(titleRequestSchema.parse({ name: "X", year: "2019", comment: "" }).year).toBe(2019);
    expect(titleRequestSchema.safeParse({ name: "X", year: "abc", comment: "" }).success).toBe(
      false,
    );
    expect(titleRequestSchema.safeParse({ name: "", year: "", comment: "" }).success).toBe(false);
  });
});
