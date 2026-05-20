import { gql } from "@/shared/lib/graphql/generated";

export const SaveMediaListEntryMutation = gql(/* GraphQL */ `
   mutation SaveMediaListEntry(
      $id: Int
      $mediaId: Int
      $status: MediaListStatus
      $score: Float
      $progress: Int
      $progressVolumes: Int
      $repeat: Int
      $priority: Int
      $private: Boolean
      $notes: String
      $hiddenFromStatusLists: Boolean
      $customLists: [String]
      $advancedScores: [Float]
      $startedAt: FuzzyDateInput
      $completedAt: FuzzyDateInput
   ) {
      SaveMediaListEntry(
         id: $id
         mediaId: $mediaId
         status: $status
         score: $score
         progress: $progress
         progressVolumes: $progressVolumes
         repeat: $repeat
         priority: $priority
         private: $private
         notes: $notes
         hiddenFromStatusLists: $hiddenFromStatusLists
         customLists: $customLists
         advancedScores: $advancedScores
         startedAt: $startedAt
         completedAt: $completedAt
      ) {
         id
         status
         score
         progress
         progressVolumes
         repeat
         priority
         private
         notes
         hiddenFromStatusLists
         customLists
         advancedScores
         updatedAt
         createdAt
         startedAt {
            year
            month
            day
         }
         completedAt {
            year
            month
            day
         }
         media {
            id
            type
         }
      }
   }
`);
