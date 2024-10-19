import { Manga } from "./manga.model";

export interface Subscription {
    id: string;
    rating: number;
    manga: Manga;
    chapters: Chapter[];
}

export interface Chapter {
    id: string;
    mangaId: string;
    number: number;
}