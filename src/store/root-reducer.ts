import { combineSlices } from "@reduxjs/toolkit";
import { playerSlice } from "@/features/player";
import { subtitleSettingsSlice } from "@/features/subtitles";
import { baseApi } from "./base-api";

export const rootReducer = combineSlices(baseApi, playerSlice, subtitleSettingsSlice);
