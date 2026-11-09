import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TitleCardData } from "../types";
import { TitleCard } from "./title-card";

const title: TitleCardData = {
  id: "t1",
  slug: "paper-cities",
  type: "MOVIE",
  originalTitle: "Paper Cities",
  localizedTitle: "Бумажные города",
  year: 2022,
  cefrLevel: "B2",
  imdbRating: 7.3,
  otherRating: null,
  posterUrl: null,
  durationMinutes: 104,
  genres: ["mystery"],
};

describe("TitleCard", () => {
  it("shows the localized title in Russian with the original as meta", () => {
    render(<TitleCard title={title} locale="ru" />);
    expect(screen.getByRole("heading", { name: "Бумажные города" })).toBeInTheDocument();
    expect(screen.getByText("2022 · Paper Cities")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/title/paper-cities");
  });

  it("shows the original title in English with level and rating", () => {
    render(<TitleCard title={title} locale="en" />);
    expect(screen.getByRole("heading", { name: "Paper Cities" })).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.getByLabelText("IMDb 7.3")).toBeInTheDocument();
  });
});
