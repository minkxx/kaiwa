import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";

import { ANILIST_CLIENT_ID, ANILIST_CLIENT_SECRET, ANILIST_REDIRECT_URI } from "@/shared/constants";
import { logger } from "@/shared/lib/utils/logger";
import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
   const { logout, setToken } = useAuthStore();

   const discovery = {
      authorizationEndpoint: "https://anilist.co/api/v2/oauth/authorize",
   };

   const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
         clientId: ANILIST_CLIENT_ID!,
         redirectUri: ANILIST_REDIRECT_URI!,
         responseType: AuthSession.ResponseType.Code,
      },
      discovery,
   );

   useEffect(() => {
      const exchangeCodeForToken = async (code: string) => {
         try {
            const res = await fetch("https://anilist.co/api/v2/oauth/token", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
               },
               body: JSON.stringify({
                  grant_type: "authorization_code",
                  client_id: ANILIST_CLIENT_ID,
                  client_secret: ANILIST_CLIENT_SECRET,
                  redirect_uri: ANILIST_REDIRECT_URI,
                  code: code,
               }),
            });

            const data = await res.json();
            if (data.access_token) {
               const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
               setToken(data.access_token, expiresAt);
            }
         } catch (err) {
            logger.error("Token exchange failed", err);
         }
      };

      if (response?.type === "success") {
         const { code } = response.params;
         exchangeCodeForToken(code);
      }
   }, [response, setToken]);

   const isAuthenticating = Boolean(request);

   const login = () => {
      promptAsync();
   };

   return {
      isAuthenticating,
      login,
      logout,
   };
};
