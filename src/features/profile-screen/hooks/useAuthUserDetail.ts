import { useEffect } from "react";
import { useQuery } from "urql";

import { useAuthStore } from "@/stores/authStore";

import { GetAuthUserDataQuery } from "../api/getAuthUserData";

export const useAuthUserDetail = () => {
   const { isLoggedIn, userProfile, setUserProfile } = useAuthStore();

   const [authUser] = useQuery({
      query: GetAuthUserDataQuery,
      pause: !isLoggedIn || Boolean(userProfile),
      requestPolicy: "network-only",
   });

   const { data, fetching, error } = authUser;
   const profileData = userProfile ?? data?.Viewer;

   useEffect(() => {
      if (isLoggedIn && !userProfile && data?.Viewer) {
         setUserProfile(data.Viewer);
      }
   }, [data?.Viewer, isLoggedIn, setUserProfile, userProfile]);

   return { profileData, fetching, error };
};
