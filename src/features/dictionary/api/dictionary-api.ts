import { baseApi } from "@/store/base-api";
import type { ReviewWordInput, SaveWordInput, UpdateWordInput } from "../schemas/word-schemas";
import type { SavedWord, WordLookup } from "../types";

const LIST_TAG = { type: "SavedWord", id: "LIST" } as const;
const LOOKUP_TAG = { type: "SavedWord", id: "LOOKUP" } as const;

export const dictionaryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWordLookup: build.query<WordLookup, string>({
      query: (word) => `/dictionary/lookup?word=${encodeURIComponent(word)}`,
      providesTags: [LOOKUP_TAG],
    }),
    getSavedWords: build.query<SavedWord[], void>({
      query: () => "/dictionary/words",
      providesTags: (result) => [
        LIST_TAG,
        ...(result ?? []).map((word) => ({ type: "SavedWord" as const, id: word.id })),
      ],
    }),
    saveWord: build.mutation<SavedWord, SaveWordInput>({
      query: (body) => ({ url: "/dictionary/words", method: "POST", body }),
      // Lookups carry `savedWordId`, so refresh them too.
      invalidatesTags: [LIST_TAG, LOOKUP_TAG],
    }),
    updateWord: build.mutation<void, { id: string } & UpdateWordInput>({
      query: ({ id, ...body }) => ({ url: `/dictionary/words/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "SavedWord", id }],
    }),
    reviewWord: build.mutation<void, { id: string } & ReviewWordInput>({
      query: ({ id, ...body }) => ({ url: `/dictionary/words/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "SavedWord", id }],
    }),
    deleteWord: build.mutation<void, string>({
      query: (id) => ({ url: `/dictionary/words/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "SavedWord", id }, LIST_TAG, LOOKUP_TAG],
    }),
  }),
});

export const {
  useGetWordLookupQuery,
  useGetSavedWordsQuery,
  useSaveWordMutation,
  useUpdateWordMutation,
  useReviewWordMutation,
  useDeleteWordMutation,
} = dictionaryApi;
