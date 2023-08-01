import { Item } from "./item";

export interface ListResponse {
  count: number;
  next: string;
  previus?: string;
  results: Item[];
}