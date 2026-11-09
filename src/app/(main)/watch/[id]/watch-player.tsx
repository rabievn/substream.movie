"use client";

import { useCallback, useState } from "react";
import { WordLookupPanel, type WordLookupTarget } from "@/features/dictionary";
import { selectCurrentTime, VideoPlayer, type VideoPlayerTrack } from "@/features/player";
import { useWatchProgressSaver } from "@/features/watch-progress";
import { useAppSelector } from "@/store/hooks";

interface WatchPlayerProps {
  titleId: string;
  episodeId: string | null;
  /** Resume position (seconds) */
  startAt: number;
  src: string;
  originalTrack: VideoPlayerTrack | null;
  translationTrack: VideoPlayerTrack | null;
  isSignedIn: boolean;
  signInHref: string;
}

/** Composes the player with word lookup and watch-progress saving. */
export function WatchPlayer({
  titleId,
  episodeId,
  startAt,
  src,
  originalTrack,
  translationTrack,
  isSignedIn,
  signInHref,
}: WatchPlayerProps) {
  const [lookupTarget, setLookupTarget] = useState<WordLookupTarget | null>(null);
  const currentTime = useAppSelector(selectCurrentTime);
  const handleClose = useCallback(() => setLookupTarget(null), []);
  const { handleTimeUpdate, saveNow } = useWatchProgressSaver({
    titleId,
    episodeId,
    isEnabled: isSignedIn,
  });

  return (
    <VideoPlayer
      src={src}
      originalTrack={originalTrack}
      translationTrack={translationTrack}
      startAt={startAt}
      onTimeUpdate={handleTimeUpdate}
      onPause={saveNow}
      onEnded={saveNow}
      onWordClick={({ word, context, translationContext }) =>
        setLookupTarget({ word, context, translationContext })
      }
      overlay={
        lookupTarget ? (
          <WordLookupPanel
            key={lookupTarget.word + lookupTarget.context}
            target={lookupTarget}
            titleId={titleId}
            timestamp={currentTime}
            isSignedIn={isSignedIn}
            signInHref={signInHref}
            onClose={handleClose}
          />
        ) : null
      }
    />
  );
}
