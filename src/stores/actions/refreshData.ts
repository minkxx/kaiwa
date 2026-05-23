import { Image } from "expo-image";

import { GetPopularAnimeQuery } from "@/features/home-screen/api/getPopularAnime";
import { GetTrendingAnimeQuery } from "@/features/home-screen/api/getTrendingAnime";
import { GetTrendingMangaQuery } from "@/features/home-screen/api/getTrendingManga";
import {
   PopularAnimeMedia,
   TrendingAnimeMedia,
   TrendingMangaMedia,
} from "@/features/home-screen/types";
import { GetUserLibraryQuery } from "@/features/library-screen/api/getUserLibrary";
import { UserLibraryLists } from "@/features/library-screen/types";
import { GetAuthUserDataQuery } from "@/features/profile-screen/api/getAuthUserData";
import { UserProfile } from "@/features/profile-screen/types";
import { client } from "@/shared/lib/graphql/client";
import { MediaType } from "@/shared/lib/graphql/generated/graphql";
import { logger } from "@/shared/lib/utils/logger";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";

const isString = (value: string | null | undefined): value is string =>
   typeof value === "string" && value.length > 0;

export const refreshHomeScreenMedia = async () => {
   const { setTrendingAnime, setPopularAnime, setTrendingManga } = useDataStore.getState();

   logger.info("Refreshing home screen media...");

   const preloadMediaImages = async (
      mediaList: TrendingAnimeMedia | PopularAnimeMedia | TrendingMangaMedia,
   ) => {
      const urls = mediaList.map((item) => item?.coverImage?.large).filter(isString);
      urls.push(...mediaList.map((item) => item?.bannerImage).filter(isString));
      await Image.prefetch(urls).catch((err) => logger.warn("Image prefetch failed:", err));
   };

   const [trendingAnimeResult, popularAnimeResult, trendingMangaResult] = await Promise.all([
      client.query(GetTrendingAnimeQuery, {}, { requestPolicy: "network-only" }).toPromise(),
      client.query(GetPopularAnimeQuery, {}, { requestPolicy: "network-only" }).toPromise(),
      client.query(GetTrendingMangaQuery, {}, { requestPolicy: "network-only" }).toPromise(),
   ]);

   if (trendingAnimeResult.data?.Page?.media) {
      setTrendingAnime(trendingAnimeResult.data.Page.media);
      preloadMediaImages(trendingAnimeResult.data.Page.media);
   }

   if (popularAnimeResult.data?.Page?.media) {
      setPopularAnime(popularAnimeResult.data.Page.media);
      preloadMediaImages(popularAnimeResult.data.Page.media);
   }

   if (trendingMangaResult.data?.Page?.media) {
      setTrendingManga(trendingMangaResult.data.Page.media);
      preloadMediaImages(trendingMangaResult.data.Page.media);
   }

   logger.info("Home screen media refreshed");
};

export const refreshUserProfile = async () => {
   const { isLoggedIn, setUserProfile } = useAuthStore.getState();

   if (!isLoggedIn) return;

   logger.info("Refreshing user profile...");

   const preloadUserProfileImages = async (userProfile: UserProfile) => {
      const urls = [userProfile.bannerImage, userProfile.avatar?.large].filter(isString);
      await Image.prefetch(urls).catch((err) => logger.warn("Image prefetch failed:", err));
   };

   const userProfileResult = await client
      .query(GetAuthUserDataQuery, {}, { requestPolicy: "network-only" })
      .toPromise();

   if (userProfileResult.data?.Viewer) {
      setUserProfile(userProfileResult.data.Viewer);
      preloadUserProfileImages(userProfileResult.data.Viewer);
   }

   logger.info("User profile refreshed");
};

export const refreshUserLibrary = async () => {
   const { isLoggedIn, userProfile, setUserAnimeLibraryLists, setUserMangaLibraryLists } =
      useAuthStore.getState();
   if (!isLoggedIn || !userProfile) return;

   logger.info("Refreshing user library...");

   const preloadUserLibraryImages = async (lists: UserLibraryLists) => {
      const urls = lists
         .flatMap((list) => list?.entries)
         .map((entry) => entry?.media?.coverImage?.large)
         .filter(isString);
      await Image.prefetch(urls).catch((err) => logger.warn("Image prefetch failed:", err));
   };

   const [animeResult, mangaResult] = await Promise.all([
      client
         .query(
            GetUserLibraryQuery,
            { userId: userProfile.id, type: MediaType.Anime },
            { requestPolicy: "network-only" },
         )
         .toPromise(),
      client
         .query(
            GetUserLibraryQuery,
            { userId: userProfile.id, type: MediaType.Manga },
            { requestPolicy: "network-only" },
         )
         .toPromise(),
   ]);

   if (animeResult.error) {
      logger.error("Failed to fetch anime library:", animeResult.error);
   }
   if (mangaResult.error) {
      logger.error("Failed to fetch manga library:", mangaResult.error);
   }

   if (animeResult.data?.MediaListCollection?.lists) {
      setUserAnimeLibraryLists(animeResult.data.MediaListCollection.lists);
      preloadUserLibraryImages(animeResult.data.MediaListCollection.lists);
   }
   if (mangaResult.data?.MediaListCollection?.lists) {
      setUserMangaLibraryLists(mangaResult.data.MediaListCollection.lists);
      preloadUserLibraryImages(mangaResult.data.MediaListCollection.lists);
   }

   logger.info("User library refreshed");
};

export const refreshAppData = async () => {
   await Promise.all([refreshHomeScreenMedia(), refreshUserProfile()]);
   await refreshUserLibrary();
};
