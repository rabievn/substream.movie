"use client";

import { useEffect, useRef } from "react";
import { findCueIndex, type SubtitleCue } from "@/features/subtitles";

/**
 * When enabled, pauses playback as soon as a subtitle line ends,
 * giving the learner time to read it.
 */
export function usePauseOnSubtitle(
  cues: readonly SubtitleCue[],
  currentTime: number,
  isEnabled: boolean,
  pause: () => void,
) {
  const lastCueIndexRef = useRef(-1);

  useEffect(() => {
    const index = findCueIndex(cues, currentTime);
    const previous = lastCueIndexRef.current;
    lastCueIndexRef.current = index;
    if (!isEnabled || previous === -1 || index === previous) return;

    const endedCue = cues[previous];
    // Only when time moved forward past the end of the line (not on seeks backwards).
    if (endedCue && currentTime >= endedCue.end && currentTime - endedCue.end < 1) pause();
  }, [cues, currentTime, isEnabled, pause]);
}
