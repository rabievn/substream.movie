"use client";

import clsx from "clsx";
import { Maximize, Minimize, Pause, PauseCircle, Play, Rewind } from "lucide-react";
import type { CSSProperties } from "react";
import { VisuallyHidden } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { formatTime } from "../format-time";
import { PLAYBACK_RATES, type PlaybackRate } from "../model/player-slice";
import styles from "./player-controls.module.scss";

const toPlaybackRate = (value: string): PlaybackRate =>
  PLAYBACK_RATES.find((rate) => rate === Number(value)) ?? 1;

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackRate;
  isFullscreen: boolean;
  subtitleToggles: {
    original: { label: string; isOn: boolean; isAvailable: boolean };
    translation: { label: string; isOn: boolean; isAvailable: boolean };
    isPauseOnSubtitleOn: boolean;
  };
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onReplayLine: () => void;
  onRateChange: (rate: PlaybackRate) => void;
  onToggleOriginal: () => void;
  onToggleTranslation: () => void;
  onTogglePauseOnSubtitle: () => void;
  onToggleFullscreen: () => void;
}

export function PlayerControls(props: PlayerControlsProps) {
  const { t } = useI18n();
  const { isPlaying, currentTime, duration, playbackRate, isFullscreen, subtitleToggles } = props;

  return (
    <div className={styles.root} data-player-controls>
      <input
        type="range"
        className={styles.seek}
        aria-label={t.player.seek}
        aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(event) => props.onSeek(Number(event.target.value))}
        style={
          { "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as CSSProperties
        }
      />
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.button}
          aria-label={isPlaying ? t.player.pause : t.player.play}
          onClick={props.onTogglePlay}
        >
          {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label={t.player.replayLine}
          title={t.player.replayLine}
          onClick={props.onReplayLine}
        >
          <Rewind aria-hidden="true" />
        </button>
        <span className={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className={styles.right}>
          {(["original", "translation"] as const).map((kind) => {
            const toggle = subtitleToggles[kind];
            if (!toggle.isAvailable) return null;
            return (
              <button
                key={kind}
                type="button"
                className={clsx(styles.chip, toggle.isOn && styles.isOn)}
                aria-pressed={toggle.isOn}
                title={kind === "original" ? t.player.originalSubs : t.player.translationSubs}
                onClick={kind === "original" ? props.onToggleOriginal : props.onToggleTranslation}
              >
                {toggle.label}
                <VisuallyHidden>
                  {" — "}
                  {kind === "original" ? t.player.originalSubs : t.player.translationSubs}
                </VisuallyHidden>
              </button>
            );
          })}
          <button
            type="button"
            className={clsx(styles.button, subtitleToggles.isPauseOnSubtitleOn && styles.isOn)}
            aria-pressed={subtitleToggles.isPauseOnSubtitleOn}
            aria-label={t.player.pauseOnSubtitle}
            title={t.player.pauseOnSubtitle}
            onClick={props.onTogglePauseOnSubtitle}
          >
            <PauseCircle aria-hidden="true" />
          </button>
          <select
            className={styles.speed}
            aria-label={t.player.speed}
            value={playbackRate}
            onChange={(event) => props.onRateChange(toPlaybackRate(event.target.value))}
          >
            {PLAYBACK_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}×
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.button}
            aria-label={isFullscreen ? t.player.exitFullscreen : t.player.fullscreen}
            title={isFullscreen ? t.player.exitFullscreen : t.player.fullscreen}
            onClick={props.onToggleFullscreen}
          >
            {isFullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
