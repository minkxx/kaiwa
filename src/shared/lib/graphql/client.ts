import NetInfo from "@react-native-community/netinfo";
import { authExchange } from "@urql/exchange-auth";
import { retryExchange } from "@urql/exchange-retry";
import { cacheExchange, Client, errorExchange, type Exchange, fetchExchange } from "urql";
import { fromPromise, mergeMap, pipe } from "wonka";

import { ANILIST_API_URL } from "@/shared/constants";
import { useAuthStore } from "@/stores/authStore";

import { logger } from "../utils/logger";

// Utility to wait for connection
const waitForConnection = () => {
   return new Promise<void>((resolve) => {
      const unsubscribe = NetInfo.addEventListener((state) => {
         if (state.isConnected && state.isInternetReachable) {
            unsubscribe();
            resolve();
         }
      });
   });
};

// Custom exchange to pause operations when offline
const offlineExchange: Exchange =
   ({ forward }) =>
   (ops$) => {
      return forward(
         pipe(
            ops$,
            mergeMap((operation) => {
               return fromPromise(
                  NetInfo.fetch().then(async (state) => {
                     if (!state.isConnected || !state.isInternetReachable) {
                        await waitForConnection();
                     }
                     return operation;
                  }),
               );
            }),
         ),
      );
   };

export const client = new Client({
   url: ANILIST_API_URL,
   preferGetMethod: false,
   fetchOptions: {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Accept: "application/json",
      },
   },
   fetch: async (url, options) => {
      return fetch(url, options).then((response) => {
         const rateLimit = response.headers.get("x-ratelimit-limit");
         const remaining = response.headers.get("x-ratelimit-remaining");
         const reset = response.headers.get("x-ratelimit-reset");

         if (rateLimit && remaining)
            logger.info(`Rate limit: ${rateLimit} Rate remaining: ${remaining}`);

         if (remaining === "0" && reset && rateLimit) {
            const resetDate = new Date(parseInt(reset) * 1000);
            const resetInSeconds = Math.ceil((resetDate.getTime() - Date.now()) / 1000);
            logger.warn(
               `Rate limit exceeded! Reset in ${resetInSeconds} seconds at:`,
               resetDate.toLocaleTimeString(),
            );
         }

         return response;
      });
   },
   exchanges: [
      offlineExchange,
      cacheExchange,
      retryExchange({
         initialDelayMs: 1000,
         maxNumberAttempts: 5,
         retryIf: (error, _operation) => {
            // Retry on network errors
            if (error.networkError) return true;

            // Retry on rate limit errors (Too Many Requests)
            if (error.graphQLErrors?.some((err) => err.message?.includes("Too Many Requests"))) {
               return true;
            }

            return false;
         },
      }),
      authExchange(async (utils) => {
         return {
            addAuthToOperation(operation) {
               const token = useAuthStore.getState().token;

               if (!token) return operation;

               return utils.appendHeaders(operation, {
                  Authorization: `Bearer ${token}`,
               });
            },
            didAuthError(error, _operation) {
               // Check for 401 Unauthorized or specific AniList auth errors
               return error.response?.status === 401;
            },
            async refreshAuth() {
               // If the token is invalid or expired, trigger a logout
               // In AniList, tokens are long-lived, so usually you just log out
               useAuthStore.getState().logout();
            },
            willAuthError(_operation) {
               const { token, expiresAt } = useAuthStore.getState();
               if (!token) return true;
               if (expiresAt && Date.now() > expiresAt * 1000) return true;
               return false;
            },
         };
      }),
      errorExchange({
         onError(error) {
            if (error.networkError) {
            }
         },
      }),
      fetchExchange,
   ],
});
