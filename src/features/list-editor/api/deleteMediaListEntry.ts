import { gql } from "@/shared/lib/graphql/generated";

export const DeleteMediaListEntryMutation = gql(/* GraphQL */ `
   mutation DeleteMediaListEntry($listEntryId: Int) {
      DeleteMediaListEntry(id: $listEntryId) {
         deleted
      }
   }
`);
