import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { SubtitleSettingsState } from "./subtitle-settings-slice";
import {
  originalSubtitlesToggled,
  pauseOnSubtitleToggled,
  subtitleFontSizeChanged,
  translationSubtitlesToggled,
} from "./subtitle-settings-slice";
import { saveSubtitleSettings } from "./subtitle-settings-storage";

/** Persists subtitle settings to localStorage whenever the user changes them. */
export const subtitleSettingsListener = createListenerMiddleware();

subtitleSettingsListener.startListening({
  matcher: isAnyOf(
    originalSubtitlesToggled,
    translationSubtitlesToggled,
    pauseOnSubtitleToggled,
    subtitleFontSizeChanged,
  ),
  effect: (_action, api) => {
    const state = api.getState() as { subtitleSettings: SubtitleSettingsState };
    saveSubtitleSettings(state.subtitleSettings);
  },
});
