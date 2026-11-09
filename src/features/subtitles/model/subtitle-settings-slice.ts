import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const SUBTITLE_FONT_SIZES = ["sm", "md", "lg"] as const;
export type SubtitleFontSize = (typeof SUBTITLE_FONT_SIZES)[number];

export interface SubtitleSettingsState {
  isOriginalVisible: boolean;
  isTranslationVisible: boolean;
  shouldPauseOnSubtitle: boolean;
  fontSize: SubtitleFontSize;
}

export const initialSubtitleSettings: SubtitleSettingsState = {
  isOriginalVisible: true,
  isTranslationVisible: true,
  shouldPauseOnSubtitle: false,
  fontSize: "md",
};

export const subtitleSettingsSlice = createSlice({
  name: "subtitleSettings",
  initialState: initialSubtitleSettings,
  reducers: {
    originalSubtitlesToggled(state) {
      state.isOriginalVisible = !state.isOriginalVisible;
    },
    translationSubtitlesToggled(state) {
      state.isTranslationVisible = !state.isTranslationVisible;
    },
    pauseOnSubtitleToggled(state) {
      state.shouldPauseOnSubtitle = !state.shouldPauseOnSubtitle;
    },
    subtitleFontSizeChanged(state, action: PayloadAction<SubtitleFontSize>) {
      state.fontSize = action.payload;
    },
    /** Restores persisted settings on the client (after hydration). */
    subtitleSettingsRestored(_state, action: PayloadAction<SubtitleSettingsState>) {
      return action.payload;
    },
  },
});

export const {
  originalSubtitlesToggled,
  translationSubtitlesToggled,
  pauseOnSubtitleToggled,
  subtitleFontSizeChanged,
  subtitleSettingsRestored,
} = subtitleSettingsSlice.actions;
