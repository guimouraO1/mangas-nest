export interface Manga {
  name: string;
  date: string;
  url: string;
  about: string;
  chapter: Chapter[];
}

interface Chapter {
  id: string;
  mangaId: string;
  number: number;
}
