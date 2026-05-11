import { AnimeMedia } from "@/features/anime-detail/types";
import { MangaMedia } from "@/features/manga-detail/types";

export type SharedKeys = keyof AnimeMedia & keyof MangaMedia;
export type SharedMedia = Pick<AnimeMedia, SharedKeys>;
export type AnimeOnly = Omit<AnimeMedia, SharedKeys>;
export type MangaOnly = Omit<MangaMedia, SharedKeys>;

export type ListEditorMedia = SharedMedia & (AnimeOnly | MangaOnly);
