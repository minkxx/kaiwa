import { useEffect } from "react";
import { useQuery } from "urql";

import { MediaType } from "@/shared/lib/graphql/generated/graphql";
import { useAuthStore } from "@/stores/authStore";

import { GetUserLibraryQuery } from "../api/getUserLibrary";

export const useGetUserLibrary = () => {
   const {
      userProfile,
      userAnimeLibraryLists,
      setUserAnimeLibraryLists,
      userMangaLibraryLists,
      setUserMangaLibraryLists,
   } = useAuthStore();

   const [animeLibraryResult] = useQuery({
      query: GetUserLibraryQuery,
      variables: {
         type: MediaType.Anime,
         userId: userProfile?.id ?? null,
      },
      requestPolicy: "cache-and-network",
   });

   const {
      data: animeLibraryData,
      fetching: animeLibraryFetching,
      error: animeLibraryError,
   } = animeLibraryResult;

   const [mangaLibraryResult] = useQuery({
      query: GetUserLibraryQuery,
      variables: {
         type: MediaType.Manga,
         userId: userProfile?.id ?? null,
      },
      requestPolicy: "cache-and-network",
   });

   const {
      data: mangaLibraryData,
      fetching: mangaLibraryFetching,
      error: mangaLibraryError,
   } = mangaLibraryResult;

   useEffect(() => {
      if (!userAnimeLibraryLists) {
         if ((animeLibraryData?.MediaListCollection?.lists ?? []).length === 0) return;

         setUserAnimeLibraryLists(animeLibraryData?.MediaListCollection?.lists!);
      }
   }, [
      animeLibraryData?.MediaListCollection?.lists,
      setUserAnimeLibraryLists,
      userAnimeLibraryLists,
   ]);

   useEffect(() => {
      if (!userMangaLibraryLists) {
         if ((mangaLibraryData?.MediaListCollection?.lists ?? []).length === 0) return;

         setUserMangaLibraryLists(mangaLibraryData?.MediaListCollection?.lists!);
      }
   }, [
      mangaLibraryData?.MediaListCollection?.lists,
      setUserMangaLibraryLists,
      userMangaLibraryLists,
   ]);

   return {
      userAnimeLibraryLists,
      animeLibraryFetching,
      animeLibraryError,
      userMangaLibraryLists,
      mangaLibraryFetching,
      mangaLibraryError,
   };
};
