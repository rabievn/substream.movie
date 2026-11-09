import { describe, expect, it } from "vitest";
import { makeStore } from "@/store/store";
import { selectCurrentTime, selectIsPlaying, selectPlaybackRate } from "./player-selectors";
import { playbackPaused, playbackStarted, setPlaybackRate, timeUpdated } from "./player-slice";

describe("player slice", () => {
  it("toggles playback", () => {
    const store = makeStore();
    store.dispatch(playbackStarted());
    expect(selectIsPlaying(store.getState())).toBe(true);
    store.dispatch(playbackPaused());
    expect(selectIsPlaying(store.getState())).toBe(false);
  });

  it("clamps negative time to zero", () => {
    const store = makeStore();
    store.dispatch(timeUpdated(-5));
    expect(selectCurrentTime(store.getState())).toBe(0);
  });

  it("changes playback rate", () => {
    const store = makeStore();
    store.dispatch(setPlaybackRate(1.25));
    expect(selectPlaybackRate(store.getState())).toBe(1.25);
  });
});
