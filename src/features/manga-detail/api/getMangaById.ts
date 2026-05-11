import { gql } from "@/shared/lib/graphql/generated";

export const GetMangaByIdQuery = gql(/* GraphQL */ `
   query GetMangaById($mediaId: Int) {
      Media(id: $mediaId, type: MANGA) {
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
         chapters
         volumes
         genres
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
         tags {
            id
            name
            rank
            description
            isMediaSpoiler
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
