import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("defaults to type=button", () => {
    render(<Button>Watch</Button>);
    expect(screen.getByRole("button", { name: "Watch" })).toHaveAttribute("type", "button");
  });

  it("renders its child when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/movies">Movies</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Movies" });
    expect(link).toHaveAttribute("href", "/movies");
    expect(link).not.toHaveAttribute("type");
  });
});
