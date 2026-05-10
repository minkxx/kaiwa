import "./../../global.css";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "urql";

import { theme } from "@/shared/constants/theme";
import { client } from "@/shared/lib/graphql/client";
import { refreshAppData } from "@/stores/actions/refreshData";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
   const segments = useSegments();
   const router = useRouter();

   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      let isMounted = true;

      const preload = async () => {
         try {
            if (!isLoggedIn) {
               if (isMounted) setIsReady(true);
               return;
            }

            const { trendingAnime, popularAnime, trendingManga } = useDataStore.getState();

            const { userProfile } = useAuthStore.getState();

            const hasCachedData = Boolean(
               trendingAnime || popularAnime || trendingManga || userProfile,
            );

            if (hasCachedData) {
               if (isMounted) setIsReady(true);

               void refreshAppData().catch((error) => {
                  console.error("[SWR] Revalidation failed:", error);
               });

               return;
            }

            await refreshAppData();
         } catch (error) {
            console.error("[SWR] Startup preload failed:", error);
         } finally {
            if (isMounted) setIsReady(true);
         }
      };

      void preload();

      return () => {
         isMounted = false;
      };
   }, [isLoggedIn]);

   useEffect(() => {
      if (!isReady) return;

      SplashScreen.hideAsync();
   }, [isReady]);

   useEffect(() => {
      if (!isReady) return;

      const inAuthGroup = segments[0] === "auth";

      if (!isLoggedIn && !inAuthGroup) {
         router.replace("/auth/login");
      } else if (isLoggedIn && inAuthGroup) {
         router.replace("/(tabs)");
      }
   }, [isLoggedIn, segments, isReady, router]);

   return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg.base }}>
         <SafeAreaProvider>
            <Provider value={client}>
               <StatusBar style="light" />
               <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.bg.base }}>
                  <Stack
                     screenOptions={{
                        contentStyle: {
                           backgroundColor: theme.bg.base,
                        },
                        animation: "slide_from_left",
                     }}
                  >
                     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                     <Stack.Screen
                        name="anime/[id]"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                     <Stack.Screen
                        name="manga/[id]"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                     <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                     <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
                     <Stack.Screen
                        name="settings"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                     <Stack.Screen
                        name="list-editor"
                        options={{ headerShown: false, animation: "slide_from_right" }}
                     />
                  </Stack>
               </SafeAreaView>
            </Provider>
         </SafeAreaProvider>
      </GestureHandlerRootView>
   );
}
