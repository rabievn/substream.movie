import { baseApi } from "@/store/base-api";
import type { UpdateWatchProgressInput } from "../schemas/watch-progress-schema";

export const watchProgressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateWatchProgress: build.mutation<void, UpdateWatchProgressInput>({
      query: (body) => ({ url: "/watch-progress", method: "PUT", body }),
    }),
  }),
});

export const { useUpdateWatchProgressMutation } = watchProgressApi;
