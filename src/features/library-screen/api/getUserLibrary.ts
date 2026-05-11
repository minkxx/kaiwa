import { gql } from "@/shared/lib/graphql/generated";

export const GetUserLibraryQuery = gql(/* GraphQL */ `
   query GetUserLibrary($type: MediaType, $userId: Int) {
      MediaListCollection(type: $type, userId: $userId) {
         lists {
            name
            status
            entries {
               id
               status
               progress
               progressVolumes
               media {
                  id
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
                  episodes
                  chapters
                  volumes
                  format
                  type
                  nextAiringEpisode {
                     episode
                     airingAt
                  }
               }
            }
         }
      }
   }
`);
