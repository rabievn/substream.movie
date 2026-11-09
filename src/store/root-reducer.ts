import { combineSlices } from "@reduxjs/toolkit";
import { playerSlice } from "@/features/player";
import { baseApi } from "./base-api";

export const rootReducer = combineSlices(baseApi, playerSlice);
