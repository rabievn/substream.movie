"use client";

import { useCallback, useState } from "react";
import { WordLookupPanel, type WordLookupTarget } from "@/features/dictionary";
import { selectCurrentTime, VideoPlayer, type VideoPlayerTrack } from "@/features/player";
import { useAppSelector } from "@/store/hooks";

interface WatchPlayerProps {
  titleId: string;
  src: string;
  originalTrack: VideoPlayerTrack | null;
  translationTrack: VideoPlayerTrack | null;
  isSignedIn: boolean;
  signInHref: string;
}

/** Composes the player with word lookup (and, later, progress saving). */
export function WatchPlayer({
  titleId,
  src,
  originalTrack,
  translationTrack,
  isSignedIn,
  signInHref,
}: WatchPlayerProps) {
  const [lookupTarget, setLookupTarget] = useState<WordLookupTarget | null>(null);
  const currentTime = useAppSelector(selectCurrentTime);
  const handleClose = useCallback(() => setLookupTarget(null), []);

  return (
    <VideoPlayer
      src={src}
      originalTrack={originalTrack}
      translationTrack={translationTrack}
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
