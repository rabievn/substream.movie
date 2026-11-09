"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { subtitleSettingsRestored } from "../model/subtitle-settings-slice";
import { loadSubtitleSettings } from "../model/subtitle-settings-storage";

/** Loads saved subtitle settings once on the client (after hydration, so SSR markup matches). */
export function useRestoreSubtitleSettings() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const saved = loadSubtitleSettings();
    if (saved) dispatch(subtitleSettingsRestored(saved));
  }, [dispatch]);
}
