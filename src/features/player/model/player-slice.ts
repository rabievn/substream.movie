import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

export interface PlayerState {
  isPlaying: boolean;
  /** Seconds */
  currentTime: number;
  /** Seconds; 0 until metadata loads */
  duration: number;
  playbackRate: PlaybackRate;
}

const initialState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
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
    durationUpdated(state, action: PayloadAction<number>) {
      state.duration = Number.isFinite(action.payload) ? Math.max(0, action.payload) : 0;
    },
    setPlaybackRate(state, action: PayloadAction<PlaybackRate>) {
      state.playbackRate = action.payload;
    },
    /** New video loaded: keep the chosen speed, reset everything else. */
    playerReset(state) {
      return { ...initialState, playbackRate: state.playbackRate };
    },
  },
});

export const {
  playbackStarted,
  playbackPaused,
  timeUpdated,
  durationUpdated,
  setPlaybackRate,
  playerReset,
} = playerSlice.actions;
