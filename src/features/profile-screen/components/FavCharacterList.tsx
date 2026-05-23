import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { Text, View } from "react-native";

import { CharacterNode, UserProfile } from "../types";
import { FavCard } from "./Cards/FavCard";

interface FavCharacterListProps {
   profileData: UserProfile | null | undefined;
}

export const FavCharacterList = ({ profileData }: FavCharacterListProps) => {
   const renderFavCard = useCallback(
      ({ item }: { item: CharacterNode }) => (
         <FavCard
            id={item?.id ?? 0}
            title={item?.name?.full ?? "Name Unavailable"}
            image={item?.image?.large ?? ""}
            type="character"
         />
      ),
      [],
   );

   if (
      !profileData?.favourites?.characters?.nodes ||
      profileData.favourites.characters.nodes.length === 0
   )
      return null;

   return (
      <View>
         <Text className="mb-2 text-lg font-semibold text-text-primary">Favorite Characters</Text>
         <FlashList
            data={profileData?.favourites?.characters?.nodes}
            renderItem={renderFavCard}
            keyExtractor={(item, index) => item?.id?.toString() ?? `character-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};
