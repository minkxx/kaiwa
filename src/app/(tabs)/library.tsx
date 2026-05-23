import { FlashList } from "@shopify/flash-list";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, RefreshControl, Text, TextInput, View } from "react-native";

import { LibraryMediaCard, useLibraryData } from "@/features/library-screen";
import { theme } from "@/shared/constants/theme";
import { MediaType } from "@/shared/lib/graphql/generated/graphql";
import { refreshUserLibrary } from "@/stores/actions/refreshData";

const Library = () => {
   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = async () => {
      setRefreshing(true);
      await refreshUserLibrary();
      setRefreshing(false);
   };

   const {
      flattenedData,
      sectionOrder,
      activeType,
      setActiveType,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
   } = useLibraryData();

   return (
      <View className="w-full flex-1">
         {/* --- SEARCH & TOGGLE --- */}
         <View className="mt-2 flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center rounded-md bg-slate-900/70 px-4 py-2">
               <Search color="#94a3b8" size={18} />
               <TextInput
                  placeholder={`Search in ${activeType.toLowerCase()} list...`}
                  placeholderTextColor="#64748b"
                  className="ml-2 flex-1 text-base text-white"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
               />
            </View>

            <Pressable
               onPress={() => {
                  setActiveType((prev) =>
                     prev === MediaType.Anime ? MediaType.Manga : MediaType.Anime,
                  );
                  setStatusFilter("ALL");
               }}
               className="rounded-md bg-accent px-4 py-3 active:bg-accent-dark"
            >
               <Text className="text-[10px] font-black text-white">
                  {activeType === MediaType.Anime ? "MANGA" : "ANIME"}
               </Text>
            </Pressable>
         </View>

         <View className="mt-4" style={{ height: 40 }}>
            <FlashList
               data={sectionOrder}
               horizontal
               showsHorizontalScrollIndicator={false}
               renderItem={({ item }) => (
                  <Pressable
                     onPress={() => setStatusFilter(item)}
                     className={`mr-2 rounded-full px-5 py-2 ${statusFilter === item ? "bg-white" : "bg-slate-800"}`}
                  >
                     <Text
                        className={`text-center text-xs font-bold uppercase ${statusFilter === item ? "text-black" : "text-gray-400"}`}
                     >
                        {item}
                     </Text>
                  </Pressable>
               )}
            />
         </View>

         <View className="mt-2 flex-1 px-1">
            <FlashList
               key={`${activeType}-${statusFilter}`}
               data={flattenedData}
               keyExtractor={(item, index) =>
                  item.type === "header" ? `h-${item.name}` : `c-${item.entry.media?.id}-${index}`
               }
               getItemType={(item) => item.type}
               showsVerticalScrollIndicator={false}
               keyboardDismissMode="on-drag"
               keyboardShouldPersistTaps="handled"
               contentContainerStyle={{ paddingBottom: 100 }}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                     tintColor={theme.accent.dark}
                     colors={[theme.accent.dark]}
                     progressBackgroundColor={theme.bg.overlay}
                  />
               }
               renderItem={({ item }) => {
                  if (item.type === "header") {
                     return (
                        <Text className="mb-4 mt-8 px-2 text-2xl font-bold text-text-primary">
                           {item.name}
                        </Text>
                     );
                  }
                  const { id, media, progress, status } = item.entry;
                  return (
                     <LibraryMediaCard
                        listEntryId={id}
                        id={media?.id}
                        title={media?.title?.english ?? media?.title?.romaji}
                        image={media?.coverImage?.large}
                        episodes={media?.episodes}
                        chapters={media?.chapters}
                        volumes={media?.volumes}
                        format={media?.format}
                        type={media?.type}
                        progress={progress}
                        status={status}
                        nextAiringAt={media?.nextAiringEpisode?.airingAt}
                        nextAiringEpisode={media?.nextAiringEpisode?.episode}
                     />
                  );
               }}
               ListEmptyComponent={() => (
                  <View className="mt-20 items-center">
                     <Text className="text-gray-500">No results found in this section.</Text>
                  </View>
               )}
            />
         </View>
      </View>
   );
};

export default Library;
