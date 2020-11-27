import { IPeriod } from "./period";

export interface IDay {
  weekday: number;
  periods: IPeriod[];
}
