import { useMutation } from "urql";

import {
   DeleteMediaListEntryMutation as DeleteMediaListEntryMutationResult,
   DeleteMediaListEntryMutationVariables,
} from "@/shared/lib/graphql/generated/graphql";
import { logger } from "@/shared/lib/utils/logger";
import { refreshUserLibrary } from "@/stores/actions/refreshData";

import { DeleteMediaListEntryMutation } from "../api/deleteMediaListEntry";

interface IVariables {
   listEntryId?: number;
}

export const useDeleteMediaListEntry = (variables: IVariables) => {
   const [data, execute] = useMutation<
      DeleteMediaListEntryMutationResult,
      DeleteMediaListEntryMutationVariables
   >(DeleteMediaListEntryMutation);

   const deleteEntry = async () => {
      try {
         const mutationResult = await execute({ ...variables });

         if (mutationResult.error) {
            logger.error("[Mutation Error]:", mutationResult.error.message);
         }

         await refreshUserLibrary();
      } catch (err) {
         logger.error("[deleteEntry Failed]:", err);
      }
   };

   return { result: data.data, error: data.error, deleteEntry };
};
