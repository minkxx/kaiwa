import BottomSheet from "@gorhom/bottom-sheet";
import { Checkbox } from "expo-checkbox";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
   NumberPickerSheet,
   StatusPickerSheet,
   useSaveMediaListEntry,
} from "@/features/list-editor";
import { useDatePicker } from "@/features/list-editor/hooks/useDatePicker";
import { useDeleteMediaListEntry } from "@/features/list-editor/hooks/useDeleteMediaListEntry";
import { AnimeOnly, ListEditorMedia } from "@/features/list-editor/types";
import { SharedMedia } from "@/features/media-detail/types";
import { theme } from "@/shared/constants/theme";
import { MediaListStatus, MediaType } from "@/shared/lib/graphql/generated/graphql";
import { getMonth } from "@/shared/lib/utils/date";

const isAnimeEditorMedia = (mediaData: ListEditorMedia): mediaData is SharedMedia & AnimeOnly =>
   "episodes" in mediaData;

const getProgressTotalValue = (mediaData: ListEditorMedia | undefined) => {
   if (!mediaData) {
      return "?";
   }

   if (isAnimeEditorMedia(mediaData)) {
      return String(mediaData.episodes ?? "?");
   }

   return String(mediaData.chapters ?? "?");
};

const getProgressVolumesTotalValue = (mediaData: ListEditorMedia | undefined) => {
   if (!mediaData || !("volumes" in mediaData)) {
      return "?";
   }

   return String(mediaData.volumes ?? "?");
};

const ListEditor = () => {
   const { data } = useLocalSearchParams<{ data?: string | string[] }>();
   const statusSheetRef = useRef<BottomSheet>(null);
   const scoreSheetRef = useRef<BottomSheet>(null);
   const progressSheetRef = useRef<BottomSheet>(null);
   const progressVolumesSheetRef = useRef<BottomSheet>(null);
   const repeatSheetRef = useRef<BottomSheet>(null);

   const rawData = Array.isArray(data) ? data[0] : data;
   let mediaData: ListEditorMedia | undefined;

   if (rawData) {
      try {
         const parsedData = JSON.parse(decodeURIComponent(rawData)) as {
            Media?: ListEditorMedia;
         };
         mediaData = parsedData.Media;
      } catch {
         mediaData = undefined;
      }
   }

   const [draft, setDraft] = useState({
      status: mediaData?.mediaListEntry?.status ?? MediaListStatus.Planning,
      score: mediaData?.mediaListEntry?.score ?? 0,
      progress: mediaData?.mediaListEntry?.progress ?? 0,
      progressVolumes: mediaData?.mediaListEntry?.progressVolumes ?? 0,
      repeat: mediaData?.mediaListEntry?.repeat ?? 0,
      priority: mediaData?.mediaListEntry?.priority ?? 0,
      private: mediaData?.mediaListEntry?.private ?? false,
      notes: mediaData?.mediaListEntry?.notes ?? "",
      hiddenFromStatusLists: mediaData?.mediaListEntry?.hiddenFromStatusLists ?? false,
      startedAt: mediaData?.mediaListEntry?.startedAt ?? undefined,
      completedAt: mediaData?.mediaListEntry?.completedAt ?? undefined,
   });

   const { saveEntry } = useSaveMediaListEntry({
      id: mediaData?.mediaListEntry?.id,
      mediaId: mediaData?.id,
      ...draft,
   });

   const { deleteEntry } = useDeleteMediaListEntry({
      listEntryId: mediaData?.mediaListEntry?.id,
   });

   const { openStartDatePicker, openFinishDatePicker } = useDatePicker({
      onStartDateChange: (startDate) => setDraft((prev) => ({ ...prev, startedAt: startDate })),
      onFinishDateChange: (finishDate) =>
         setDraft((prev) => ({ ...prev, completedAt: finishDate })),
   });

   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <View style={{ flex: 1 }} className="bg-bg-base px-6 py-2">
            <Text className="text-3xl font-medium text-accent-light">
               {mediaData?.title?.english || mediaData?.title?.romaji || mediaData?.title?.native}
            </Text>

            <View className="mt-10">
               <Text className="mb-2 text-lg font-semibold text-white">General</Text>
               <View className="mb-2 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                  <View className="flex-row">
                     <View className="w-1/2">
                        <Text className="text-white">Status</Text>
                     </View>
                     <View className="w-1/2">
                        <TouchableOpacity onPress={() => statusSheetRef?.current?.expand()}>
                           <Text className="text-accent-light">{draft.status}</Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View className="flex-row items-center">
                     <View className="w-1/2">
                        <Text className="text-white">Score</Text>
                     </View>
                     <View className="w-1/2 ">
                        <TouchableOpacity onPress={() => scoreSheetRef?.current?.expand()}>
                           <Text className="text-accent-light">{draft.score}</Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View className="flex-row items-center">
                     <View className="w-1/2">
                        <Text className="text-white">
                           {mediaData?.type === MediaType.Anime ? "Episodes" : "Chapters"}
                        </Text>
                     </View>
                     <View className="w-1/2 ">
                        <TouchableOpacity onPress={() => progressSheetRef?.current?.expand()}>
                           <Text className="text-accent-light">{draft.progress}</Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  {mediaData?.type === MediaType.Manga && (
                     <View className="flex-row items-center">
                        <View className="w-1/2">
                           <Text className="text-white">Volumes</Text>
                        </View>
                        <View className="w-1/2 ">
                           <TouchableOpacity
                              onPress={() => progressVolumesSheetRef?.current?.expand()}
                           >
                              <Text className="text-accent-light">{draft.progressVolumes}</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  )}

                  <View className="flex-row items-center">
                     <View className="w-1/2">
                        <Text className="text-white">Start Date</Text>
                     </View>
                     <View className="w-1/2 ">
                        <TouchableOpacity onPress={() => openStartDatePicker(draft.startedAt)}>
                           <Text className="text-accent-light">
                              {draft.startedAt?.day
                                 ? `${draft.startedAt.day} ${getMonth(draft.startedAt.month!)} ${draft.startedAt.year}`
                                 : "-"}
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View className="flex-row items-center">
                     <View className="w-1/2">
                        <Text className="text-white">Finish Date</Text>
                     </View>
                     <View className="w-1/2 ">
                        <TouchableOpacity onPress={() => openFinishDatePicker(draft.completedAt)}>
                           <Text className="text-accent-light">
                              {draft.completedAt?.day
                                 ? `${draft.completedAt.day} ${getMonth(draft.completedAt.month!)} ${draft.completedAt.year}`
                                 : "-"}
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View className="flex-row items-center">
                     <View className="w-1/2">
                        <Text className="text-white">Total Rewatches</Text>
                     </View>
                     <View className="w-1/2 ">
                        <TouchableOpacity onPress={() => repeatSheetRef?.current?.expand()}>
                           <Text className="text-accent-light">{draft.repeat}</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </View>

            <View className="mt-10">
               <Text className="mb-2 text-lg font-semibold text-white">Others</Text>
               <View className="mb-2 gap-2 rounded-md bg-slate-900/70 px-4 py-2">
                  <View className="flex-row">
                     <View className="w-1/2">
                        <Text className="text-white">Hide from status lists</Text>
                     </View>
                     <View className="ml-auto">
                        <Checkbox
                           value={draft.hiddenFromStatusLists}
                           color={draft.hiddenFromStatusLists ? theme.accent.light : undefined}
                           onValueChange={(prev) =>
                              setDraft((prev) => ({
                                 ...prev,
                                 hiddenFromStatusLists: !prev.hiddenFromStatusLists,
                              }))
                           }
                        />
                     </View>
                  </View>

                  <View className="flex-row">
                     <View className="w-1/2">
                        <Text className="text-white">Private</Text>
                     </View>
                     <View className="ml-auto">
                        <Checkbox
                           value={draft.private}
                           color={draft.private ? theme.accent.light : undefined}
                           onValueChange={(prev) =>
                              setDraft((prev) => ({
                                 ...prev,
                                 private: !prev.private,
                              }))
                           }
                        />
                     </View>
                  </View>
               </View>
            </View>

            <View className="mb-6 mt-auto w-full flex-row items-center justify-center gap-2">
               {mediaData?.mediaListEntry?.status && (
                  <TouchableOpacity
                     onPress={deleteEntry}
                     className="w-1/2 items-center rounded-xl border border-accent-light p-4 active:opacity-80"
                  >
                     <Text className="text-lg font-bold text-accent-light">Remove from list</Text>
                  </TouchableOpacity>
               )}

               <TouchableOpacity
                  onPress={() => saveEntry(mediaData?.type!)}
                  className={`${mediaData?.mediaListEntry?.status ? "w-1/2" : "w-full"} items-center rounded-xl bg-accent-light p-4 active:opacity-80`}
               >
                  <Text className="text-lg font-bold text-bg-base">Save</Text>
               </TouchableOpacity>
            </View>

            <StatusPickerSheet
               sheetRef={statusSheetRef}
               onSelect={(status) => setDraft((prev) => ({ ...prev, status }))}
            />

            <NumberPickerSheet
               sheetRef={scoreSheetRef}
               sheetName="Score"
               initialValue={draft.score}
               totalValue="10"
               onSelect={(score) => setDraft((prev) => ({ ...prev, score }))}
            />

            <NumberPickerSheet
               sheetRef={progressSheetRef}
               sheetName={mediaData?.type === MediaType.Anime ? "Episodes" : "Chapters"}
               initialValue={draft.progress}
               totalValue={getProgressTotalValue(mediaData)}
               onSelect={(progress) => setDraft((prev) => ({ ...prev, progress }))}
            />

            <NumberPickerSheet
               sheetRef={progressVolumesSheetRef}
               sheetName="Volumes"
               initialValue={draft.progressVolumes}
               totalValue={getProgressVolumesTotalValue(mediaData)}
               onSelect={(progressVolumes) => setDraft((prev) => ({ ...prev, progressVolumes }))}
            />

            <NumberPickerSheet
               sheetRef={repeatSheetRef}
               sheetName="Rewatches"
               initialValue={draft.repeat}
               totalValue="?"
               showTotalValue={false}
               onSelect={(repeat) => setDraft((prev) => ({ ...prev, repeat }))}
            />
         </View>
      </GestureHandlerRootView>
   );
};

export default ListEditor;
