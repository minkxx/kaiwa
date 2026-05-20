import { gql } from "@/shared/lib/graphql/generated";

export const GetAnimeByIdQuery = gql(/* GraphQL */ `
   query GetAnimeById($mediaId: Int) {
      Media(id: $mediaId, type: ANIME) {
         id
         title {
            english
            romaji
            native
         }
         bannerImage
         coverImage {
            extraLarge
         }
         description
         averageScore
         favourites
         popularity
         format
         episodes
         duration
         genres
         season
         source
         status
         type
         trailer {
            id
            site
            thumbnail
         }
         startDate {
            day
            month
            year
         }
         endDate {
            day
            month
            year
         }
         studios {
            edges {
               id
               isMain
               node {
                  id
                  name
                  isAnimationStudio
                  siteUrl
               }
            }
         }
         relations {
            edges {
               id
               relationType
               node {
                  id
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
                  type
                  format
               }
            }
         }
         nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
         }
         mediaListEntry {
            id
            status
            progress
            progressVolumes
            repeat
            priority
            notes
            private
            score
            customLists
            hiddenFromStatusLists
            startedAt {
               day
               month
               year
            }
            completedAt {
               day
               month
               year
            }
         }
         tags {
            id
            name
            rank
            description
            isMediaSpoiler
         }
         recommendations {
            nodes {
               mediaRecommendation {
                  id
                  type
                  title {
                     english
                     romaji
                  }
                  coverImage {
                     large
                  }
               }
            }
         }
         externalLinks {
            color
            icon
            id
            site
            siteId
            type
            url
            language
         }
      }
   }
`);
