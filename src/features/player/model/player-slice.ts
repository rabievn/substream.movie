import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  playbackRate: PlaybackRate;
}

const initialState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  playbackRate: 1,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playbackStarted(state) {
      state.isPlaying = true;
    },
    playbackPaused(state) {
      state.isPlaying = false;
    },
    timeUpdated(state, action: PayloadAction<number>) {
      state.currentTime = Math.max(0, action.payload);
    },
    setPlaybackRate(state, action: PayloadAction<PlaybackRate>) {
      state.playbackRate = action.payload;
    },
  },
});

export const { playbackStarted, playbackPaused, timeUpdated, setPlaybackRate } =
  playerSlice.actions;
