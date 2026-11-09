import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Single RTK Query API slice. Features add their endpoints with
 * `baseApi.injectEndpoints(...)` and declare cache tags here.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Title", "Episode", "SavedWord", "WatchProgress", "List", "Request"],
  endpoints: () => ({}),
});
