import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { Text, View } from "react-native";

import { MangaNode, UserProfile } from "../types";
import { FavCard } from "./Cards/FavCard";

interface FavMangaListProps {
   profileData: UserProfile | null | undefined;
}

export const FavMangaList = ({ profileData }: FavMangaListProps) => {
   const renderFavCard = useCallback(
      ({ item }: { item: MangaNode }) => (
         <FavCard
            id={item?.id ?? 0}
            title={item?.title?.english ?? item?.title?.romaji ?? "Title Unavailable"}
            image={item?.coverImage?.extraLarge ?? ""}
            type="manga"
         />
      ),
      [],
   );

   if (!profileData?.favourites?.manga?.nodes || profileData.favourites.manga.nodes.length === 0)
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Manga</Text>
         <FlashList
            data={profileData?.favourites?.manga?.nodes}
            renderItem={renderFavCard}
            keyExtractor={(item, index) => item?.id?.toString() ?? `manga-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};
