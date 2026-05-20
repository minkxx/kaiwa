import { useMutation } from "urql";

import type {
   FuzzyDateInput,
   MediaListStatus,
   MediaType,
   SaveMediaListEntryMutation as SaveMediaListEntryMutationResult,
   SaveMediaListEntryMutationVariables,
} from "@/shared/lib/graphql/generated/graphql";
import { logger } from "@/shared/lib/utils/logger";
import { refreshUserLibrary } from "@/stores/actions/refreshData";
import { useAuthStore } from "@/stores/authStore";

import { SaveMediaListEntryMutation } from "../api/saveMediaListEntry";

interface IVariables {
   id?: number;
   mediaId?: number;
   status?: MediaListStatus;
   score?: number;
   progress?: number;
   progressVolumes?: number;
   repeat?: number;
   priority?: number;
   private?: boolean;
   notes?: string;
   hiddenFromStatusLists?: boolean;
   customLists?: string[];
   startedAt?: FuzzyDateInput;
   completedAt?: FuzzyDateInput;
}

const cleanFuzzyDate = (dateObj: any) => {
   if (!dateObj) return undefined;

   const { day, month, year } = dateObj;

   if (!day && !month && !year) {
      return undefined;
   }

   return { day, month, year };
};

export const useSaveMediaListEntry = (variables: IVariables) => {
   const updateOptimistically = useAuthStore((state) => state.updateEntryOptimistically);

   const [data, execute] = useMutation<
      SaveMediaListEntryMutationResult,
      SaveMediaListEntryMutationVariables
   >(SaveMediaListEntryMutation);

   const saveEntry = async (type: MediaType) => {
      try {
         const sanitizedVariables = {
            ...variables,
            startedAt: cleanFuzzyDate(variables.startedAt),
            completedAt: cleanFuzzyDate(variables.completedAt),
         };

         if (variables.mediaId) {
            const { id: _, mediaId: __, ...updates } = sanitizedVariables;
            updateOptimistically(variables.mediaId, updates, type);
         }

         const mutationResult = await execute(sanitizedVariables);

         if (mutationResult.error) {
            logger.error("[Mutation Error]:", mutationResult.error.message);
         }

         await refreshUserLibrary();
      } catch (err) {
         logger.error("[saveEntry Failed]:", err);
      }
   };

   return { result: data.data, error: data.error, saveEntry };
};
