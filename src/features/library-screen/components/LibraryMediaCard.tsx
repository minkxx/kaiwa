import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import { useSaveMediaListEntry } from "@/features/list-editor";
import { theme } from "@/shared/constants/theme";
import { MediaListStatus, MediaType } from "@/shared/lib/graphql/generated/graphql";
import { formatAiringDate } from "@/shared/lib/utils/date";

interface LibraryMediaCardProps {
   listEntryId: number;
   id: number | null | undefined;
   title: string | null | undefined;
   image: string | null | undefined;
   episodes?: number | null | undefined;
   chapters?: number | null | undefined;
   volumes?: number | null | undefined;
   format: string | null | undefined;
   type: string | null | undefined;
   progress: number | null | undefined;
   status: string | null | undefined;
   nextAiringEpisode?: number | null | undefined;
   nextAiringAt?: number | null | undefined;
}

export const LibraryMediaCard = ({
   listEntryId,
   id,
   title,
   image,
   episodes,
   chapters,
   volumes,
   format,
   type,
   progress,
   status,
   nextAiringAt,
   nextAiringEpisode,
}: LibraryMediaCardProps) => {
   const router = useRouter();

   // 1. Calculate Progress Percentage
   const totalCount = episodes ?? chapters ?? 0;
   const currentProgress = progress ?? 0;
   const progressPercentage = totalCount > 0 ? (currentProgress / totalCount) * 100 : 0;

   const { saveEntry: savePlusEntry } = useSaveMediaListEntry({
      id: listEntryId,
      mediaId: id ? id : undefined,
      status: MediaListStatus.Current,
      progress: currentProgress + 1,
   });

   const { saveEntry: saveMinusEntry } = useSaveMediaListEntry({
      id: listEntryId,
      mediaId: id ? id : undefined,
      status: MediaListStatus.Current,
      progress: currentProgress - 1 >= 0 ? currentProgress - 1 : undefined,
   });

   const handleOnPress = () => {
      if (type === MediaType.Anime) {
         router.push(`/anime/${id}`);
      } else if (type === MediaType.Manga) {
         router.push(`/manga/${id}`);
      }
   };

   const handlePlusPress = async () => {
      await savePlusEntry(type === MediaType.Anime ? MediaType.Anime : MediaType.Manga);
   };

   const handleMinusPress = async () => {
      await saveMinusEntry(type === MediaType.Anime ? MediaType.Anime : MediaType.Manga);
   };

   return (
      <Pressable
         onPress={handleOnPress}
         className="mb-4 flex-row overflow-hidden rounded-md bg-[#11212D]/70"
      >
         {image ? (
            <Image
               source={{ uri: image }}
               style={{
                  width: 110,
                  height: 140,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
               }}
               contentFit="cover"
               cachePolicy="disk"
               transition={200}
               recyclingKey={id?.toString()}
            />
         ) : (
            <View className="h-[140] w-[100] rounded-l-md bg-slate-800" />
         )}

         <View className="min-w-0 flex-1 justify-between">
            <View className="px-2">
               <View className="flex gap-3">
                  <Text className="mt-2 text-[16px] font-medium text-white" numberOfLines={2}>
                     {title ?? "Title Unavailable"}
                  </Text>
                  <View className="flex-row items-center gap-2">
                     <Text className="text-[13px] text-white">{format?.split("_").join(" ")}</Text>
                     {nextAiringAt && <Text className="text-accent-light">●</Text>}
                     {nextAiringAt && (
                        <Text className="text-sm text-accent-light">
                           EP {nextAiringEpisode} on {formatAiringDate(nextAiringAt)}
                        </Text>
                     )}
                  </View>
                  {typeof nextAiringEpisode === "number" &&
                  typeof progress === "number" &&
                  progress < nextAiringEpisode - 1 ? (
                     <Text className="text-sm font-semibold text-accent-light">
                        {nextAiringEpisode - progress - 1} EP BEHIND
                     </Text>
                  ) : (
                     <Text></Text>
                  )}
               </View>

               <View className="flex gap-2">
                  <View className="flex-row items-end justify-between">
                     <View></View>
                     <View className="flex-row items-end justify-between gap-4">
                        <TouchableOpacity
                           onPress={handlePlusPress}
                           className="rounded-md bg-bg-overlay"
                           style={{ padding: 2 }}
                        >
                           <Plus color={theme.accent.light} size={28} />
                        </TouchableOpacity>
                        <TouchableOpacity
                           onPress={handleMinusPress}
                           className="rounded-md bg-bg-overlay"
                           style={{ padding: 2 }}
                        >
                           <Minus color={theme.accent.light} size={28} />
                        </TouchableOpacity>
                        <Text className="text-sm text-text-secondary">
                           {progress} / {episodes ?? chapters ?? "?"}
                        </Text>
                     </View>
                  </View>
               </View>
            </View>

            <View className="h-1.5 w-full overflow-hidden bg-slate-800">
               <View
                  className="h-full bg-accent"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
               />
            </View>
         </View>
      </Pressable>
   );
};
