export interface SubtitleCue {
  id: number;
  /** Seconds */
  start: number;
  /** Seconds */
  end: number;
  text: string;
}

export interface SubtitleTrackInfo {
  id: string;
  language: string;
  kind: "ORIGINAL" | "TRANSLATION";
  label: string;
  url: string;
}
