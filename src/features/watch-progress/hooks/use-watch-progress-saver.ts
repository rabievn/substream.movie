"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUpdateWatchProgressMutation } from "../api/watch-progress-api";

const SAVE_INTERVAL_MS = 10_000;
const MIN_POSITION_SECONDS = 5;

interface Options {
  titleId: string;
  episodeId: string | null;
  isEnabled: boolean;
}

/**
 * Saves playback position: at most every 10 s while playing, plus a final
 * save via sendBeacon when the page is hidden or the player unmounts.
 */
export function useWatchProgressSaver({ titleId, episodeId, isEnabled }: Options) {
  const [updateWatchProgress] = useUpdateWatchProgressMutation();
  const latestRef = useRef<{ position: number; duration: number } | null>(null);
  const lastSavedAtRef = useRef(0);

  const buildPayload = useCallback(() => {
    const latest = latestRef.current;
    if (!latest || latest.position < MIN_POSITION_SECONDS || !Number.isFinite(latest.duration))
      return null;
    return {
      titleId,
      episodeId,
      positionSeconds: latest.position,
      durationSeconds: latest.duration,
    };
  }, [titleId, episodeId]);

  const flushWithBeacon = useCallback(() => {
    const payload = buildPayload();
    if (!isEnabled || !payload) return;
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon?.("/api/watch-progress", blob);
  }, [buildPayload, isEnabled]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushWithBeacon();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flushWithBeacon);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flushWithBeacon);
      flushWithBeacon(); // client-side navigation away from the player
    };
  }, [flushWithBeacon]);

  /** Call from the video's timeupdate. */
  const handleTimeUpdate = useCallback(
    (position: number, duration: number) => {
      latestRef.current = { position, duration };
      if (!isEnabled) return;
      const now = Date.now();
      if (now - lastSavedAtRef.current < SAVE_INTERVAL_MS) return;
      const payload = buildPayload();
      if (!payload) return;
      lastSavedAtRef.current = now;
      void updateWatchProgress(payload);
    },
    [buildPayload, isEnabled, updateWatchProgress],
  );

  /** Save immediately (e.g. on pause or end). */
  const saveNow = useCallback(() => {
    const payload = buildPayload();
    if (!isEnabled || !payload) return;
    lastSavedAtRef.current = Date.now();
    void updateWatchProgress(payload);
  }, [buildPayload, isEnabled, updateWatchProgress]);

  return { handleTimeUpdate, saveNow };
}
