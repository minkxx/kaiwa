import BottomSheet, {
   BottomSheetBackdrop,
   BottomSheetTextInput,
   BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";

import { theme } from "@/shared/constants/theme";

interface Props {
   sheetRef: React.RefObject<BottomSheetMethods | null>;
   sheetName: string;
   initialValue: number;
   totalValue: string;
   onSelect: (score: number) => void;
}

export const NumberPickerSheet = ({
   sheetRef,
   sheetName,
   initialValue,
   totalValue,
   onSelect,
}: Props) => {
   const snapPoints = useMemo(() => ["24%"], []);
   const [localValue, setLocalValue] = useState(initialValue.toString());

   useEffect(() => {
      setLocalValue(initialValue.toString());
   }, [initialValue]);

   const handleSet = () => {
      const numericValue = parseInt(localValue) || 0;
      onSelect(Math.min(Math.max(numericValue), parseInt(totalValue) || numericValue));
      sheetRef.current?.close();
      setLocalValue(initialValue.toString());
   };

   return (
      <BottomSheet
         ref={sheetRef}
         index={-1}
         snapPoints={snapPoints}
         enablePanDownToClose
         keyboardBehavior="interactive"
         keyboardBlurBehavior="restore"
         onChange={() => Keyboard.dismiss()}
         backdropComponent={(props) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
         )}
         backgroundStyle={{ backgroundColor: "#11212D" }}
         handleIndicatorStyle={{ backgroundColor: theme.accent.light }}
      >
         <BottomSheetView className="items-center px-6">
            <Text className="mb-4 text-lg font-bold text-white">Set {sheetName}</Text>

            <View className="mb-6 flex-row items-center justify-center gap-4">
               <View className="border-b-2 border-accent-light/30">
                  <BottomSheetTextInput
                     value={localValue}
                     onChangeText={setLocalValue}
                     keyboardType="numeric"
                     style={{
                        color: "white",
                        fontSize: 30,
                        fontWeight: "bold",
                        minWidth: 100,
                        textAlign: "center",
                     }}
                  />
               </View>
               <View>
                  <Text
                     style={{
                        color: "white",
                        fontSize: 30,
                        fontWeight: "bold",
                        minWidth: 60,
                        textAlign: "center",
                     }}
                  >
                     / {totalValue}
                  </Text>
               </View>
            </View>

            <TouchableOpacity
               onPress={handleSet}
               className="w-full items-center rounded-xl bg-accent-light p-4 active:opacity-80"
            >
               <Text className="text-lg font-bold text-bg-base">Set</Text>
            </TouchableOpacity>
         </BottomSheetView>
      </BottomSheet>
   );
};
