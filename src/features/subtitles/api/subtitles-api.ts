import { baseApi } from "@/store/base-api";
import { parseSubtitles } from "../lib/parse-subtitles";
import type { SubtitleCue } from "../types";

export const subtitlesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Downloads a .vtt/.srt file (same-origin or CORS-enabled URL) and parses it. */
    getSubtitleCues: build.query<SubtitleCue[], string>({
      async queryFn(url) {
        try {
          const response = await fetch(url);
          if (!response.ok)
            return { error: { status: response.status, data: response.statusText } };
          return { data: parseSubtitles(await response.text()) };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
      keepUnusedDataFor: 600,
    }),
  }),
});

export const { useGetSubtitleCuesQuery } = subtitlesApi;
