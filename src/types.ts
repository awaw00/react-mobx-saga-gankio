import { GankType } from './constants';

export interface GankDataCache {
  data: GankDataItem[];
  currentPage: number;
}

export interface GankApiResponse<T> {
  category?: GankType[];
  error: boolean;
  results: T;
}

export type ImageUrl = string;
export type DateString = string;

export interface GankDataItem {
  _id: string;
  who: string;
  used: boolean;
  url: string;
  desc: string;
  type: GankType;
  images: ImageUrl[];
  source: string;
  createdAt: DateString;
  publishedAt: DateString;
}
