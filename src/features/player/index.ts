export {
  playerSlice,
  playbackStarted,
  playbackPaused,
  timeUpdated,
  setPlaybackRate,
  PLAYBACK_RATES,
  type PlaybackRate,
  type PlayerState,
} from "./model/player-slice";
export { selectIsPlaying, selectCurrentTime, selectPlaybackRate } from "./model/player-selectors";
