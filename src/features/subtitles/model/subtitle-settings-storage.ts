import { z } from "zod";
import { SUBTITLE_FONT_SIZES, type SubtitleSettingsState } from "./subtitle-settings-slice";

const STORAGE_KEY = "subtitle-settings";

const storedSettingsSchema = z.object({
  isOriginalVisible: z.boolean(),
  isTranslationVisible: z.boolean(),
  shouldPauseOnSubtitle: z.boolean(),
  fontSize: z.enum(SUBTITLE_FONT_SIZES),
});

export function loadSubtitleSettings(): SubtitleSettingsState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = storedSettingsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveSubtitleSettings(settings: SubtitleSettingsState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable (private mode / quota) — settings stay in memory.
  }
}
