import { useRouter } from "expo-router";
import { SquarePen } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { AnimeHeroBanner, AnimeInfoTable, useAnimeDetail } from "@/features/anime-detail";
import {
   CharacterList,
   GenreList,
   MediaScreenHeader,
   RecommendationList,
   RelationList,
   StatsBar,
   SynopsisCard,
   TagList,
   TrailerCard,
   useCharacters,
   useMediaId,
} from "@/features/media-detail";
import { FloatingButton } from "@/shared/components/ui/FloatingButton";

const Anime = () => {
   const router = useRouter();

   const mediaId = useMediaId();
   const characters = useCharacters(mediaId);
   const { data, fetching, error } = useAnimeDetail(mediaId);

   // close button and option button handlers
   // TODO: Takes more time to close the screen than direct back button navigation. Optimize by using a custom animation or using native navigation pop if possible.
   const handleScreenClose = () => {
      router.replace("/(tabs)");
   };

   const handleOptionPress = () => {
      // Implement option button logic, e.g., show action sheet
   };

   const handlerEditPress = () => {
      router.push(`/list-editor?id=${data?.Media?.id}&type=${data?.Media?.type}`);
   };

   if (error) console.error("Error fetching anime data for media ID ", mediaId, ":", error);

   if (fetching)
      return (
         <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
         </View>
      );

   if (!data)
      return <Text className="flex-1 items-center justify-center text-white">Anime not found</Text>;

   return (
      <View className="flex-1">
         <MediaScreenHeader onClosePress={handleScreenClose} onOptionPress={handleOptionPress} />
         <ScrollView
            className="min-h-screen flex-1"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
         >
            <AnimeHeroBanner media={data.Media} />
            <View className="flex px-4" style={{ gap: 12 }}>
               <StatsBar media={data.Media} />
               <GenreList media={data.Media} />
            </View>
            <View className="flex p-4" style={{ gap: 28 }}>
               <SynopsisCard text={data?.Media?.description} />
               <CharacterList mediaId={mediaId} {...characters} />
               <AnimeInfoTable media={data.Media} />
               <TagList media={data.Media} />
               <RelationList media={data.Media} />
               <TrailerCard media={data.Media} />
               <RecommendationList media={data.Media} />
            </View>
            <View className="mb-20"></View>
         </ScrollView>

         <FloatingButton Icon={SquarePen} onPress={handlerEditPress} bottomPos={80} rightPos={34} />
      </View>
   );
};

export default Anime;
