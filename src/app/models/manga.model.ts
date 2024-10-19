export interface Manga {
  id: string;
  name: string;
  date: WeekDays;
  rating?: any;
  url: string;
  about?: string | null;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
}

export enum WeekDays {
  Seg = 'seg',
  Ter = 'ter',
  Qua = 'qua',
  Qui = 'qui',
  Sex = 'sex',
  Sab = 'sab',
  Dom = 'dom',
}

export interface MangaWithImage extends Manga {
  image: File;
}

export interface MangaWithRating extends Manga {
  rating: File;
}
