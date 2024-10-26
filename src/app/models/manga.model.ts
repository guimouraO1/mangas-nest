import { Subscription } from "./subscriptions.model";


export interface Manga {
  id: string;
  name: string;
  date: WeekDays;
  url: string;
  about?: string | null;
  subscriptions?: Subscription[];
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

