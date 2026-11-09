"use client";

import { useEffect, useRef } from "react";

export interface PlayerShortcutHandlers {
  onTogglePlay: () => void;
  onSeekBy: (seconds: number) => void;
  onReplayLine: () => void;
  onToggleOriginal: () => void;
  onToggleTranslation: () => void;
  onTogglePauseOnSubtitle: () => void;
  onToggleFullscreen: () => void;
}

const SEEK_STEP_SECONDS = 5;

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Global keyboard shortcuts for the watch page. Ignored while typing or with modifier keys. */
export function usePlayerShortcuts(handlers: PlayerShortcutHandlers) {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      // Inside an open dialog/popover (e.g. word lookup) let it handle keys.
      if (event.target instanceof HTMLElement && event.target.closest("[role=dialog]")) return;

      const h = handlersRef.current;
      const actions: Record<string, () => void> = {
        " ": h.onTogglePlay,
        k: h.onTogglePlay,
        ArrowLeft: () => h.onSeekBy(-SEEK_STEP_SECONDS),
        ArrowRight: () => h.onSeekBy(SEEK_STEP_SECONDS),
        a: h.onReplayLine,
        s: h.onToggleOriginal,
        t: h.onToggleTranslation,
        p: h.onTogglePauseOnSubtitle,
        f: h.onToggleFullscreen,
      };
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const action = actions[key];
      if (!action) return;
      // Space on a focused button would also "click" it — handle it once here.
      if (key === " " && event.target instanceof HTMLButtonElement) return;
      event.preventDefault();
      action();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
