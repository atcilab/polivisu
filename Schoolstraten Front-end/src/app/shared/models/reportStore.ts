import { IReport } from "./report";

export interface IReportStore {
  isLoading: boolean;
  firstPeriod: { target: IReport[]; impact: IReport[] };
  secondPeriod: { target: IReport[]; impact: IReport[] };
}
