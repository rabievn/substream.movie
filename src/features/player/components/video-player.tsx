"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  findPreviousCueIndex,
  originalSubtitlesToggled,
  pauseOnSubtitleToggled,
  selectSubtitleSettings,
  SubtitleOverlay,
  translationSubtitlesToggled,
  useGetSubtitleCuesQuery,
  useRestoreSubtitleSettings,
  type SubtitleCue,
  type WordClickPayload,
} from "@/features/subtitles";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePauseOnSubtitle } from "../hooks/use-pause-on-subtitle";
import { usePlayerShortcuts } from "../hooks/use-player-shortcuts";
import {
  durationUpdated,
  playbackPaused,
  playbackStarted,
  playerReset,
  setPlaybackRate,
  timeUpdated,
} from "../model/player-slice";
import {
  selectCurrentTime,
  selectDuration,
  selectIsPlaying,
  selectPlaybackRate,
} from "../model/player-selectors";
import { PlayerControls } from "./player-controls";
import styles from "./video-player.module.scss";

const EMPTY_CUES: SubtitleCue[] = [];

export interface VideoPlayerTrack {
  language: string;
  url: string;
}

interface VideoPlayerProps {
  src: string;
  originalTrack: VideoPlayerTrack | null;
  translationTrack: VideoPlayerTrack | null;
  /** Resume position in seconds */
  startAt?: number;
  /** Called on word click (the player pauses first). */
  onWordClick?: (payload: WordClickPayload) => void;
  /** Rendered inside the player (works in fullscreen), e.g. the word popover. */
  overlay?: ReactNode;
  onTimeUpdate?: (time: number, duration: number) => void;
  onEnded?: () => void;
  onPause?: () => void;
}

export function VideoPlayer(props: VideoPlayerProps) {
  const { src, originalTrack, translationTrack, startAt = 0 } = props;
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isPlaying = useAppSelector(selectIsPlaying);
  const currentTime = useAppSelector(selectCurrentTime);
  const duration = useAppSelector(selectDuration);
  const playbackRate = useAppSelector(selectPlaybackRate);
  const settings = useAppSelector(selectSubtitleSettings);
  useRestoreSubtitleSettings();

  const { data: originalCues = EMPTY_CUES } = useGetSubtitleCuesQuery(originalTrack?.url ?? "", {
    skip: !originalTrack,
  });
  const { data: translationCues = EMPTY_CUES } = useGetSubtitleCuesQuery(
    translationTrack?.url ?? "",
    {
      skip: !translationTrack,
    },
  );

  useEffect(() => {
    // Metadata may already be loaded before hydration (cached video).
    const video = videoRef.current;
    if (video && video.readyState >= 1) dispatch(durationUpdated(video.duration));
    return () => {
      dispatch(playerReset());
    };
  }, [dispatch, src]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const pause = useCallback(() => videoRef.current?.pause(), []);
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }, []);
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.max(0, Math.min(time, video.duration || time));
  }, []);
  const replayLine = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Small offset so pressing right after a line starts goes to the previous one.
    const index = findPreviousCueIndex(originalCues, video.currentTime - 0.3);
    seekTo(index >= 0 ? originalCues[index]!.start : video.currentTime - 5);
    void video.play().catch(() => undefined);
  }, [originalCues, seekTo]);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen?.();
  }, []);

  usePauseOnSubtitle(originalCues, currentTime, settings.shouldPauseOnSubtitle, pause);
  usePlayerShortcuts({
    onTogglePlay: togglePlay,
    onSeekBy: (seconds) => seekTo((videoRef.current?.currentTime ?? 0) + seconds),
    onReplayLine: replayLine,
    onToggleOriginal: () => dispatch(originalSubtitlesToggled()),
    onToggleTranslation: () => dispatch(translationSubtitlesToggled()),
    onTogglePauseOnSubtitle: () => dispatch(pauseOnSubtitleToggled()),
    onToggleFullscreen: toggleFullscreen,
  });

  const handleWordClick = (payload: WordClickPayload) => {
    pause();
    props.onWordClick?.(payload);
  };

  return (
    <div ref={rootRef} className={clsx(styles.root, !isPlaying && styles.isPaused)}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          dispatch(durationUpdated(video.duration));
          if (startAt > 0 && startAt < video.duration - 5) video.currentTime = startAt;
        }}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          dispatch(timeUpdated(video.currentTime));
          props.onTimeUpdate?.(video.currentTime, video.duration);
        }}
        onPlay={() => dispatch(playbackStarted())}
        onPause={() => {
          dispatch(playbackPaused());
          props.onPause?.();
        }}
        onEnded={props.onEnded}
        onError={() => setHasError(true)}
      />
      {hasError ? (
        <p role="alert" className={styles.error}>
          {t.player.videoError}
        </p>
      ) : null}
      <SubtitleOverlay
        originalCues={originalCues}
        translationCues={translationCues}
        currentTime={currentTime}
        originalLanguage={originalTrack?.language ?? "en"}
        translationLanguage={translationTrack?.language ?? "ru"}
        onWordClick={handleWordClick}
      />
      <PlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        isFullscreen={isFullscreen}
        subtitleToggles={{
          original: {
            label: originalTrack?.language ?? "",
            isOn: settings.isOriginalVisible,
            isAvailable: Boolean(originalTrack),
          },
          translation: {
            label: translationTrack?.language ?? "",
            isOn: settings.isTranslationVisible,
            isAvailable: Boolean(translationTrack),
          },
          isPauseOnSubtitleOn: settings.shouldPauseOnSubtitle,
        }}
        onTogglePlay={togglePlay}
        onSeek={seekTo}
        onReplayLine={replayLine}
        onRateChange={(rate) => dispatch(setPlaybackRate(rate))}
        onToggleOriginal={() => dispatch(originalSubtitlesToggled())}
        onToggleTranslation={() => dispatch(translationSubtitlesToggled())}
        onTogglePauseOnSubtitle={() => dispatch(pauseOnSubtitleToggled())}
        onToggleFullscreen={toggleFullscreen}
      />
      {props.overlay}
    </div>
  );
}
