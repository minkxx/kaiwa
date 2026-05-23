import { useRouter } from "expo-router";
import {
   ArrowLeft,
   ChevronRight,
   Computer,
   Download,
   ExternalLink,
   Info,
   Layers,
   LogOut,
   LucideIcon,
   RefreshCcw,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useExpoUpdate } from "@/shared/hooks/useExpoUpdate";
import { useAuthStore } from "@/stores/authStore";

interface SettingItemProps {
   icon: LucideIcon;
   label: string;
   value?: string | null;
   onPress?: () => void;
   isLoading?: boolean;
   showChevron?: boolean;
   color?: string;
   isLast?: boolean;
}

const SettingItem = ({
   icon: Icon,
   label,
   value,
   onPress,
   isLoading = false,
   showChevron = true,
   color = "#94a3b8",
   isLast = false,
}: SettingItemProps) => (
   <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || !onPress}
      className={`flex-row items-center justify-between px-2 py-4 ${
         !isLast ? "border-b border-gray-800" : ""
      }`}
   >
      <View className="flex-row items-center gap-x-3">
         <Icon size={20} color={color} />
         <Text className="text-base text-gray-200">{label}</Text>
      </View>
      <View className="flex-row items-center gap-x-2">
         {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
         ) : (
            value && <Text className="text-sm text-gray-500">{value}</Text>
         )}
         {showChevron && !isLoading && <ChevronRight size={18} color="#4b5563" />}
      </View>
   </TouchableOpacity>
);

const Settings = () => {
   const router = useRouter();
   const handleBackPress = () => {
      if (router.canGoBack()) {
         router.back();
      }
   };
   const { logout } = useAuthStore();
   const {
      appVersion,
      runtimeVersion,
      checkForUpdates,
      downloadAndApplyUpdate,
      isUpdateAvailable,
      isUpdatePending,
      isChecking,
      isDownloading,
      isEmbedded,
   } = useExpoUpdate();

   return (
      <View className="flex-1 bg-[#030014]">
         <TouchableOpacity onPress={handleBackPress} className="p-3">
            <View
               className="h-14 w-14 items-center justify-center rounded-full bg-bg-overlay"
               style={{ borderRadius: 50 }}
            >
               <ArrowLeft size={28} color="#fff" />
            </View>
         </TouchableOpacity>

         <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            {/* Account Section */}
            <Text className="mb-2 ml-2 mt-8 text-xs font-bold uppercase text-gray-500">
               Account
            </Text>
            <View className="rounded-2xl bg-[#11212D]/50 px-2">
               <SettingItem
                  icon={LogOut}
                  label="Logout"
                  onPress={logout}
                  color="#ef4444"
                  isLast={true}
               />
            </View>

            {/* Updates Section */}
            <Text className="mb-2 ml-2 mt-8 text-xs font-bold uppercase text-gray-500">
               App Updates
            </Text>
            <View className="rounded-2xl bg-[#11212D]/50 px-2">
               <SettingItem
                  icon={RefreshCcw}
                  label="Check for Updates"
                  onPress={checkForUpdates}
                  isLoading={isChecking}
                  isLast={!isUpdateAvailable && !isUpdatePending}
               />

               {(isUpdateAvailable || isUpdatePending) && (
                  <SettingItem
                     icon={Download}
                     label="Install Update"
                     onPress={downloadAndApplyUpdate}
                     isLoading={isDownloading}
                     color="#10b981"
                     isLast={true}
                  />
               )}
            </View>

            {/* Information Section */}
            <Text className="mb-2 ml-2 mt-8 text-xs font-bold uppercase text-gray-500">
               System Info
            </Text>
            <View className="mb-10 rounded-2xl bg-[#11212D]/50 px-2">
               <SettingItem
                  icon={Info}
                  label="App Version"
                  value={appVersion}
                  showChevron={false}
               />
               <SettingItem
                  icon={Layers}
                  label="Runtime"
                  value={runtimeVersion}
                  showChevron={false}
               />
               <SettingItem
                  icon={Info}
                  label="Build Type"
                  value={isEmbedded ? "Production Build" : "OTA Bundle"}
                  showChevron={false}
                  isLast={true}
               />
            </View>

            {/* Developer Info */}
            <Text className="mb-2 ml-2 text-xs font-bold uppercase text-gray-500">
               Developer Info
            </Text>
            <View className="mb-10 rounded-2xl bg-[#11212D]/50 px-2">
               <SettingItem
                  icon={Computer}
                  label="Developer GitHub"
                  value="@monsurcodes"
                  onPress={() => Linking.openURL("https://github.com/monsurcodes")}
                  color="#fff"
               />
               <SettingItem
                  icon={ExternalLink}
                  label="Project Repository"
                  onPress={() => Linking.openURL("https://github.com/monsurcodes/kaiwa")}
                  color="#fff"
                  isLast={true}
               />
            </View>
         </ScrollView>
      </View>
   );
};

export default Settings;
