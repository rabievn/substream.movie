import { describe, expect, it } from "vitest";
import {
  findCueIndex,
  findPreviousCueIndex,
  parseSubtitles,
  tokenizeLine,
} from "./parse-subtitles";

const VTT = `WEBVTT

1
00:00:01.000 --> 00:00:04.000
Hey, <i>are</i> you coming?

00:00:04.500 --> 00:00:07.250 align:start
Second line
continues here
`;

const SRT = `1\r\n00:00:01,000 --> 00:00:02,500\r\nHello &amp; welcome\r\n\r\n2\r\n00:01:02,000 --> 00:01:03,000\r\n{\\an8}Top line\r\n`;

describe("parseSubtitles", () => {
  it("parses WebVTT with tags, settings and multi-line text", () => {
    expect(parseSubtitles(VTT)).toEqual([
      { id: 0, start: 1, end: 4, text: "Hey, are you coming?" },
      { id: 1, start: 4.5, end: 7.25, text: "Second line\ncontinues here" },
    ]);
  });

  it("parses SRT with CRLF, comma decimals and entities", () => {
    expect(parseSubtitles(SRT)).toEqual([
      { id: 0, start: 1, end: 2.5, text: "Hello & welcome" },
      { id: 1, start: 62, end: 63, text: "Top line" },
    ]);
  });

  it("skips malformed blocks", () => {
    expect(
      parseSubtitles("WEBVTT\n\nnot a cue\n\n00:00:05.000 --> 00:00:01.000\nbackwards"),
    ).toEqual([]);
  });
});

describe("cue lookup", () => {
  const cues = parseSubtitles(VTT);

  it("finds the active cue", () => {
    expect(findCueIndex(cues, 0.5)).toBe(-1);
    expect(findCueIndex(cues, 2)).toBe(0);
    expect(findCueIndex(cues, 4.2)).toBe(-1);
    expect(findCueIndex(cues, 5)).toBe(1);
    expect(findCueIndex(cues, 99)).toBe(-1);
  });

  it("finds the previous cue in gaps", () => {
    expect(findPreviousCueIndex(cues, 4.2)).toBe(0);
    expect(findPreviousCueIndex(cues, 0)).toBe(-1);
  });
});

describe("tokenizeLine", () => {
  it("keeps contractions and hyphenated words together", () => {
    const tokens = tokenizeLine("I'd love a well-known café!");
    expect(tokens.filter((token) => token.isWord).map((token) => token.value)).toEqual([
      "I'd",
      "love",
      "a",
      "well-known",
      "café",
    ]);
    expect(tokens.map((token) => token.value).join("")).toBe("I'd love a well-known café!");
  });
});
