import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";

import {
   AboutCard,
   FavAnimeList,
   FavCharacterList,
   FavMangaList,
   FavStaffList,
   FavStudioList,
   ProfileHeroBanner,
   StatsInfo,
   useAuthUserDetail,
} from "@/features/profile-screen";
import { FloatingButton } from "@/shared/components/ui/FloatingButton";
import { theme } from "@/shared/constants/theme";
import { logger } from "@/shared/lib/utils/logger";
import { refreshUserProfile } from "@/stores/actions/refreshData";

const Profile = () => {
   const router = useRouter();

   const [refreshing, setRefreshing] = useState(false);
   const onRefresh = async () => {
      setRefreshing(true);
      await refreshUserProfile();
      setRefreshing(false);
   };

   const { profileData, fetching, error } = useAuthUserDetail();

   if (error) logger.error("Error fetching profile data:", error);

   if (!profileData && fetching)
      return (
         <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={30} />
         </View>
      );

   return (
      <View className="w-full flex-1">
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
            <ProfileHeroBanner profileData={profileData} />
            <AboutCard aboutText={profileData?.about} />
            <View className="mb-24 mt-6 flex-1 gap-6">
               <StatsInfo profileData={profileData} />
               <FavAnimeList profileData={profileData} />
               <FavMangaList profileData={profileData} />
               <FavCharacterList profileData={profileData} />
               <FavStaffList profileData={profileData} />
               <FavStudioList profileData={profileData} />
            </View>
         </ScrollView>

         <FloatingButton Icon={Settings} onPress={() => router.push("/settings")} />
      </View>
   );
};

export default Profile;
