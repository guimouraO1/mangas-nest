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
  Mon = 'mon',
  Tue = 'tue',
  Wed = 'wed',
  Thu = 'thu',
  Fri = 'fri',
  Sat = 'sat',
  Sun = 'sun',
}

export interface MangaWithImage extends Manga {
  image: File;
}

export interface MangaWithRating extends Manga {
  rating: File;
}
