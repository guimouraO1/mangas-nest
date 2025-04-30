import { Subscription } from './subscriptions.model';

export interface Manga {
  id: string;
  name: string;
  date: WeekDays;
  url: string;
  about?: string | null;
  subscriptions?: Subscription[];
  subscribed: boolean;
}

export interface CreateManga {
  name: string;
  date: WeekDays;
  url: string;
  about?: string | null;
}

export type WeekDaysType = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export enum WeekDays {
  Mon = 'mon',
  Tue = 'tue',
  Wed = 'wed',
  Thu = 'thu',
  Fri = 'fri',
  Sat = 'sat',
  Sun = 'sun',
}

