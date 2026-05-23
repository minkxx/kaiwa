import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { Text, View } from "react-native";

import { StaffNode, UserProfile } from "../types";
import { FavCard } from "./Cards/FavCard";

interface FavStaffListProps {
   profileData: UserProfile | null | undefined;
}

export const FavStaffList = ({ profileData }: FavStaffListProps) => {
   const renderFavCard = useCallback(
      ({ item }: { item: StaffNode }) => (
         <FavCard
            id={item?.id ?? 0}
            title={item?.name?.full ?? "Name Unavailable"}
            image={item?.image?.large ?? ""}
            type="staff"
         />
      ),
      [],
   );

   if (!profileData?.favourites?.staff?.nodes || profileData.favourites.staff.nodes.length === 0)
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Staff</Text>
         <FlashList
            data={profileData?.favourites?.staff?.nodes}
            renderItem={renderFavCard}
            keyExtractor={(item, index) => item?.id?.toString() ?? `staff-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};
