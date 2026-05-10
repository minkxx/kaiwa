import { useMutation } from "urql";

import type {
   FuzzyDateInput,
   MediaListStatus,
   MediaType,
   SaveMediaListEntryMutation as SaveMediaListEntryMutationResult,
   SaveMediaListEntryMutationVariables,
} from "@/shared/lib/graphql/generated/graphql";
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

export const useSaveMediaListEntry = (variables: IVariables) => {
   const updateOptimistically = useAuthStore((state) => state.updateEntryOptimistically);

   const [data, execute] = useMutation<
      SaveMediaListEntryMutationResult,
      SaveMediaListEntryMutationVariables
   >(SaveMediaListEntryMutation);

   const saveEntry = async (type: MediaType) => {
      try {
         if (variables.mediaId) {
            const { id: _, mediaId: __, ...updates } = variables;

            updateOptimistically(variables.mediaId, updates, type);
         }

         const mutationResult = await execute({ ...variables });

         if (mutationResult.error) {
            // TODO: rollback if the mutation fails
            console.error("[Mutation Error]:", mutationResult.error.message);
         }

         await refreshUserLibrary();
      } catch (err) {
         console.error("[saveEntry Failed]:", err);
      }
   };

   return { result: data.data, error: data.error, saveEntry };
};
