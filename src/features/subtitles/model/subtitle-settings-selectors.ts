import type { RootState } from "@/store/store";

export const selectSubtitleSettings = (state: RootState) => state.subtitleSettings;
export const selectIsOriginalVisible = (state: RootState) =>
  state.subtitleSettings.isOriginalVisible;
export const selectIsTranslationVisible = (state: RootState) =>
  state.subtitleSettings.isTranslationVisible;
export const selectShouldPauseOnSubtitle = (state: RootState) =>
  state.subtitleSettings.shouldPauseOnSubtitle;
export const selectSubtitleFontSize = (state: RootState) => state.subtitleSettings.fontSize;
