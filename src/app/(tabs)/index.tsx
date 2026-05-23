import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import {
   ActivityIndicator,
   Pressable,
   RefreshControl,
   ScrollView,
   Text,
   useWindowDimensions,
   View,
} from "react-native";

import { ReleasingTodayCard, TrendingMediaCard, useHomeData } from "@/features/home-screen";
import { theme } from "@/shared/constants/theme";
import { MediaType } from "@/shared/lib/graphql/generated/graphql";
import { refreshHomeScreenMedia } from "@/stores/actions/refreshData";

interface SearchBarButtonProps {
   onPress: () => void;
}

const SearchBarButton = ({ onPress }: SearchBarButtonProps) => (
   <Pressable onPress={onPress} className="mt-2 rounded-md bg-slate-900/70 p-4">
      <View className="flex-row items-center">
         <Search color="white" size={20} />
         <Text className="ml-2 text-xl text-gray-400/70">What are you looking for?</Text>
      </View>
   </Pressable>
);

interface MediaSectionProps {
   title: string;
   data: unknown[] | null | undefined;
   renderItem: ({ item }: { item: unknown }) => React.ReactElement;
}

const MediaSection = ({ title, data, renderItem }: MediaSectionProps) => {
   if (!data || data.length === 0) return null;
   return (
      <>
         <Text className="mb-2 mt-10 text-xl font-semibold text-white">{title}</Text>
         <FlashList
            style={{ height: 350, width: "100%" }}
            data={data}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </>
   );
};

const Index = () => {
   const { width } = useWindowDimensions();
   const CARD_WIDTH = width * 0.8;

   const router = useRouter();
   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = async () => {
      setRefreshing(true);
      await refreshHomeScreenMedia();
      setRefreshing(false);
   };

   const {
      trendingAnimeData,
      trendingMangaData,
      popularAnimeData,
      isInitialLoading,
      releasingEntries,
   } = useHomeData();

   if (isInitialLoading) {
      return (
         <View className="flex-1 gap-3">
            <SearchBarButton onPress={() => router.push("/search")} />
            <View className="flex-1 items-center justify-center">
               <ActivityIndicator size={30} />
            </View>
         </View>
      );
   }

   return (
      <View className="flex-1 gap-3">
         <SearchBarButton onPress={() => router.push("/search")} />

         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
               <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.accent.dark}
                  colors={[theme.accent.dark]}
                  progressBackgroundColor={theme.bg.overlay}
               />
            }
         >
            {releasingEntries && releasingEntries.length > 0 && (
               <View>
                  <Text className="mb-2 mt-6 text-xl font-semibold text-white">
                     Releasing Today
                  </Text>
                  <FlashList
                     data={releasingEntries}
                     renderItem={({ item }) => <ReleasingTodayCard item={item} />}
                     horizontal
                     showsHorizontalScrollIndicator={false}
                  />
               </View>
            )}

            <MediaSection
               title="Trending Anime"
               data={trendingAnimeData}
               renderItem={({ item }) => (
                  <TrendingMediaCard
                     media={item as NonNullable<typeof trendingAnimeData>[number]}
                     mediaType={MediaType.Anime}
                     cardWidth={CARD_WIDTH}
                  />
               )}
            />

            <MediaSection
               title="Popular Anime"
               data={popularAnimeData}
               renderItem={({ item }) => (
                  <TrendingMediaCard
                     media={item as NonNullable<typeof popularAnimeData>[number]}
                     mediaType={MediaType.Anime}
                     cardWidth={CARD_WIDTH}
                  />
               )}
            />

            <MediaSection
               title="Trending Manga"
               data={trendingMangaData}
               renderItem={({ item }) => (
                  <TrendingMediaCard
                     media={item as NonNullable<typeof trendingMangaData>[number]}
                     mediaType={MediaType.Manga}
                     cardWidth={CARD_WIDTH}
                  />
               )}
            />

            <View className="my-4" />
         </ScrollView>
      </View>
   );
};

export default Index;
