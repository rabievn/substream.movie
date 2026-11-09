import { baseApi } from "@/store/base-api";
import { toSearchParams, type TitleFilterQuery } from "../schemas/title-filter-schema";
import type { TitlePage } from "../types";

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTitles: build.infiniteQuery<TitlePage, TitleFilterQuery, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      },
      query: ({ queryArg, pageParam }) =>
        `/titles?${toSearchParams({ ...queryArg, page: pageParam })}`,
      providesTags: [{ type: "Title", id: "LIST" }],
    }),
  }),
});

export const { useGetTitlesInfiniteQuery } = catalogApi;
