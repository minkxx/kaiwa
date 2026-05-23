import type { GetAuthUserDataQuery } from "@/shared/lib/graphql/generated/graphql";

export type UserProfile = NonNullable<GetAuthUserDataQuery["Viewer"]>;

export type AnimeNode = NonNullable<
   NonNullable<NonNullable<UserProfile["favourites"]>["anime"]>["nodes"]
>[number];

export type MangaNode = NonNullable<
   NonNullable<NonNullable<UserProfile["favourites"]>["manga"]>["nodes"]
>[number];

export type StaffNode = NonNullable<
   NonNullable<NonNullable<UserProfile["favourites"]>["staff"]>["nodes"]
>[number];

export type CharacterNode = NonNullable<
   NonNullable<NonNullable<UserProfile["favourites"]>["characters"]>["nodes"]
>[number];
