import { useGlobalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { MediaType } from "@/shared/lib/graphql/generated/graphql";

const ListEditor = () => {
   const { id, type } = useGlobalSearchParams<{ id: string; type: MediaType }>();
   console.log(id, type);

   return (
      <View>
         <Text className="text-text-primary">ListEditor</Text>
      </View>
   );
};

export default ListEditor;
