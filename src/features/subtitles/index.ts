export { useGetSubtitleCuesQuery } from "./api/subtitles-api";
export { SubtitleOverlay, type WordClickPayload } from "./components/subtitle-overlay";
export { useRestoreSubtitleSettings } from "./hooks/use-restore-subtitle-settings";
export {
  findCueIndex,
  findPreviousCueIndex,
  parseSubtitles,
  tokenizeLine,
} from "./lib/parse-subtitles";
export {
  selectIsOriginalVisible,
  selectIsTranslationVisible,
  selectShouldPauseOnSubtitle,
  selectSubtitleFontSize,
  selectSubtitleSettings,
} from "./model/subtitle-settings-selectors";
export { subtitleSettingsListener } from "./model/subtitle-settings-listener";
export {
  initialSubtitleSettings,
  originalSubtitlesToggled,
  pauseOnSubtitleToggled,
  SUBTITLE_FONT_SIZES,
  subtitleFontSizeChanged,
  subtitleSettingsRestored,
  subtitleSettingsSlice,
  translationSubtitlesToggled,
  type SubtitleFontSize,
  type SubtitleSettingsState,
} from "./model/subtitle-settings-slice";
export type { SubtitleCue, SubtitleTrackInfo } from "./types";
