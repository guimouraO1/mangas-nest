export interface Manga {
  id: string;
  name: string;
  date: WeekDays;
  url: string;
  about?: string | null;
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
