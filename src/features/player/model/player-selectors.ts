import type { RootState } from "@/store/store";

export const selectIsPlaying = (state: RootState) => state.player.isPlaying;
export const selectCurrentTime = (state: RootState) => state.player.currentTime;
export const selectPlaybackRate = (state: RootState) => state.player.playbackRate;
