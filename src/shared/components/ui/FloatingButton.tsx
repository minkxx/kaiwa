import { LucideIcon } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

import { theme } from "@/shared/constants/theme";

interface FloatingButtonProps {
   Icon: LucideIcon;
   strokeWidth?: number;
   onPress?: () => void;
   bottomPos?: number;
   rightPos?: number;
}

export const FloatingButton = ({
   Icon,
   strokeWidth,
   onPress,
   bottomPos,
   rightPos,
}: FloatingButtonProps) => {
   return (
      <TouchableOpacity
         activeOpacity={0.8}
         onPress={onPress}
         style={[styles.button, { bottom: bottomPos ?? 24, right: rightPos ?? 24 }]}
         className="items-center justify-center rounded-lg shadow-lg shadow-slate-500/50"
      >
         <Icon color="#CCD0CF" size={32} strokeWidth={strokeWidth} />
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      position: "absolute",
      zIndex: 50,
      width: 50,
      height: 50,
      elevation: 8,
      backgroundColor: theme.bg.overlay,
   },
});
