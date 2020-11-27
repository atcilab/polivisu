import { IReport } from "./report";

export interface IObject {
  type: ObjectType;
  report: number;
  total: number;
}

export type ObjectType = "pedestrian" | "bike" | "car" | "lorry";
