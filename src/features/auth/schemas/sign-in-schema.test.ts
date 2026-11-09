import { describe, expect, it } from "vitest";
import { signInSchema } from "./sign-in-schema";

describe("signInSchema", () => {
  it("normalizes the email", () => {
    const result = signInSchema.parse({ email: "  Learner@Example.COM ", callbackUrl: "/movies" });
    expect(result).toEqual({ email: "learner@example.com", callbackUrl: "/movies" });
  });

  it("rejects external callback URLs", () => {
    expect(
      signInSchema.parse({ email: "a@b.co", callbackUrl: "https://evil.example" }).callbackUrl,
    ).toBe("/profile");
    expect(signInSchema.parse({ email: "a@b.co", callbackUrl: "//evil.example" }).callbackUrl).toBe(
      "/profile",
    );
  });

  it("rejects invalid emails", () => {
    expect(signInSchema.safeParse({ email: "nope", callbackUrl: "/" }).success).toBe(false);
  });
});
