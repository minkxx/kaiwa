import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/features/auth";

const Login = () => {
   const { isAuthenticating, login } = useAuth();

   return (
      <View className="flex-1 items-center justify-center bg-[#030014]">
         <TouchableOpacity
            disabled={!isAuthenticating}
            onPress={() => login()}
            className="rounded-lg bg-[#11212D] px-10 py-4  shadow-lg shadow-emerald-500/20"
         >
            <Text className="text-lg font-bold text-white">Login with AniList</Text>
         </TouchableOpacity>
      </View>
   );
};

export default Login;
