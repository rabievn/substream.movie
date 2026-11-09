import { describe, expect, it } from "vitest";
import { parseTitleFilter, toSearchParams } from "./title-filter-schema";

describe("parseTitleFilter", () => {
  it("parses valid params", () => {
    const filter = parseTitleFilter(
      new URLSearchParams(
        "lang=en&level=a2,B1&genre=drama&from=2015&to=2024&country=us&sort=new&page=2",
      ),
    );
    expect(filter).toEqual({
      lang: "EN",
      level: ["A2", "B1"],
      genre: "drama",
      from: 2015,
      to: 2024,
      country: "US",
      sort: "new",
      page: 2,
    });
  });

  it("drops invalid values instead of throwing", () => {
    const filter = parseTitleFilter({
      lang: "klingon",
      level: "Z9,B2",
      genre: "<script>",
      from: "abc",
      sort: "random",
      page: "-3",
    });
    expect(filter).toEqual({ level: ["B2"], sort: "popular", page: 1 });
  });

  it("takes the first value of repeated params", () => {
    expect(parseTitleFilter({ sort: ["imdb", "new"] }).sort).toBe("imdb");
  });
});

describe("toSearchParams", () => {
  it("omits defaults and round-trips", () => {
    const params = toSearchParams({
      level: ["B1", "B2"],
      sort: "popular",
      page: 1,
      genre: "comedy",
    });
    expect(params.toString()).toBe("level=B1%2CB2&genre=comedy");
    expect(parseTitleFilter(params)).toMatchObject({ level: ["B1", "B2"], genre: "comedy" });
  });
});
