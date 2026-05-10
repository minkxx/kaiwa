import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { useState } from "react";
import { Alert } from "react-native";

import { logger } from "../lib/utils/logger";

export const useExpoUpdate = () => {
   const { currentlyRunning, isUpdateAvailable, isUpdatePending } = Updates.useUpdates();
   const [isChecking, setIsChecking] = useState(false);
   const [isDownloading, setIsDownloading] = useState(false);

   const appVersion = Constants.expoConfig?.version || "unknown";
   const runtimeVersion = Updates.runtimeVersion;

   // Check if an update exists on the server
   const checkForUpdates = async () => {
      if (__DEV__) {
         Alert.alert("Development Mode", "Update checks are disabled in development mode.");
         return;
      }

      try {
         setIsChecking(true);
         const result = await Updates.checkForUpdateAsync();
         if (!result.isAvailable) {
            Alert.alert("No Updates", "You are already on the latest version.");
         }
      } catch (error) {
         Alert.alert("Error", "Could not check for updates.");
         logger.error(error);
      } finally {
         setIsChecking(false);
      }
   };

   // Download the update and reload the app
   const downloadAndApplyUpdate = async () => {
      if (__DEV__) {
         Alert.alert("Development Mode", "Update checks are disabled in development mode.");
         return;
      }

      try {
         setIsDownloading(true);
         await Updates.fetchUpdateAsync();

         // Once downloaded, we must reload to apply the JS bundle
         await Updates.reloadAsync();
      } catch (error) {
         Alert.alert("Error", "Failed to download the update.");
         logger.error(error);
      } finally {
         setIsDownloading(false);
      }
   };

   return {
      appVersion,
      runtimeVersion,
      isUpdateAvailable,
      isUpdatePending,
      isChecking,
      isDownloading,
      checkForUpdates,
      downloadAndApplyUpdate,
      isEmbedded: currentlyRunning.isEmbeddedLaunch,
   };
};
