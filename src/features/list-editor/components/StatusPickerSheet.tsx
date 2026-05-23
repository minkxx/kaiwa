import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { theme } from "@/shared/constants/theme";
import { MediaListStatus } from "@/shared/lib/graphql/generated/graphql";

interface Props {
   sheetRef: React.RefObject<BottomSheetMethods | null>;
   onSelect: (status: MediaListStatus) => void;
}

export const StatusPickerSheet = ({ sheetRef, onSelect }: Props) => {
   const snapPoints = useMemo(() => ["45%"], []);
   const statuses = Object.values(MediaListStatus);

   const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
         <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
   );

   return (
      <BottomSheet
         ref={sheetRef}
         index={-1}
         snapPoints={snapPoints}
         enablePanDownToClose
         backdropComponent={renderBackdrop}
         backgroundStyle={{ backgroundColor: "#161B22" }}
         handleIndicatorStyle={{ backgroundColor: theme.accent.light }}
      >
         <BottomSheetView className="p-6">
            <Text className="mb-6 text-lg font-bold text-white">Select Status</Text>
            <View className="gap-y-3">
               {statuses.map((status) => (
                  <TouchableOpacity
                     key={status}
                     onPress={() => {
                        onSelect(status);
                        sheetRef.current?.close();
                     }}
                     className="bg-bg-default active:border-accent-default rounded-xl border border-white/5 p-4"
                  >
                     <Text className="text-center font-medium text-text-secondary">{status}</Text>
                  </TouchableOpacity>
               ))}
            </View>
         </BottomSheetView>
      </BottomSheet>
   );
};
