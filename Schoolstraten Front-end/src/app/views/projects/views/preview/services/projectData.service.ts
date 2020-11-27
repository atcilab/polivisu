import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Period } from "src/app/shared/models/period.model";
import { IReport, IReportStore, IWeather } from "src/app/shared/models";
import * as moment from "moment-timezone";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class ProjectDataService {
  constructor(private _http: HttpClient, private _cookie: CookieService) {
    // moment.tz.setDefault("Etc/UTC");
  }

  // Has second period
  private readonly _hasSecondPeriod = new BehaviorSubject<boolean>(false);
  readonly hasSecondPeriod$ = this._hasSecondPeriod.asObservable();
  set hasSecondPeriod(val: boolean) {
    this._hasSecondPeriod.next(val);
  }
  get hasSecondPeriod(): boolean {
    return this._hasSecondPeriod.getValue();
  }

  // Periods
  private readonly _periods = new BehaviorSubject<Period[]>([]);
  readonly periods$ = this._periods.asObservable();

  get periods(): Period[] {
    return this._periods.getValue();
  }

  set periods(val: Period[]) {
    this._periods.next(val);
  }

  addPeriod(val: Period) {
    this.periods = [...this.periods, val];
  }

  removePeriod(val: Period) {
    this.periods = this.periods.filter((p) => p.id !== val.id);
  }

  // Reports
  private readonly _reports = new BehaviorSubject<IReportStore>({
    isLoading: true,
    firstPeriod: {
      target: [],
      impact: [],
    },
    secondPeriod: {
      target: [],
      impact: [],
    },
  });
  readonly reports$ = this._reports.asObservable();

  get reports() {
    return this._reports.getValue();
  }

  set reports(val: IReportStore) {
    this._reports.next(val);
  }

  getReports(target: number, impact: number[]) {
    const values = [target, ...impact];
    const baseURLs = values.map(
      (i) => `https://telraam-api.net/v0/reports/${i}`
    );
    if (!this.hasSecondPeriod) {
      this.reports = {
        ...this.reports,
        isLoading: true,
      };
      // Only one period
      const period = this.periods[0];
      const startDate = moment(period.range[0])
        .add(5, "h")
        .startOf("d")
        .format("YYYY-MM-DD HH:mm:ss[Z]");
      const endDate = moment(period.range[1])
        .add(5, "h")
        .endOf("d")
        .format("YYYY-MM-DD HH:mm:ss[Z]");

      Promise.all(
        baseURLs.map((i) =>
          this._http
            .post<{ report: IReport[] }>(i, {
              time_start: startDate,
              time_end: endDate,
              level: "segments",
              format: "per-hour",
            })
            .toPromise()
        )
      )
        .then((response) => {
          let reports = response.map((r) => r.report);
          // Filtered reports
          let targetReports: IReport[] = reports[0];
          let impactReports: IReport[] = reports
            .splice(1)
            .reduce((a, b) => [...a, ...b], []);

          this.reports = {
            ...this.reports,
            isLoading: false,
            firstPeriod: {
              target: targetReports,
              impact: impactReports,
            },
          };
        })
        .catch((error) => console.log("Something went wrong"));
    } else {
      this.reports = {
        ...this.reports,
        isLoading: true,
      };
      // Two periods
      const period = this.periods[0];
      const startDate = moment(period.range[0])
        .add(5, "h")
        .startOf("d")
        .format("YYYY-MM-DD HH:mm:ss[Z]");
      const endDate = moment(period.range[1])
        .add(5, "h")
        .endOf("d")
        .format("YYYY-MM-DD HH:mm:ss[Z]");

      const period2 = this.periods[1];
      const startDate2 = moment(period2.range[0])
        .add(5, "h")
        .startOf("d")
        .format("YYYY-MM-DD HH:mm:ss[Z]");
      const endDate2 = moment(period2.range[1])
        .add(5, "h")
        .endOf("d")
        .format("YYYY-MM-DD HH:mm:ss[Z]");

      Promise.all(
        baseURLs.map((i) =>
          this._http
            .post<{ report: IReport[] }>(i, {
              time_start: startDate,
              time_end: endDate,
              level: "segments",
              format: "per-hour",
            })
            .toPromise()
        )
      )
        .then((response) => {
          let reports = response.map((r) => r.report);
          // Filtered reports
          let targetReports: IReport[] = reports[0];
          let impactReports: IReport[] = reports
            .splice(1)
            .reduce((a, b) => [...a, ...b], []);

          this.reports = {
            ...this.reports,
            isLoading: false,
            firstPeriod: {
              target: targetReports,
              impact: impactReports,
            },
          };
        })
        .catch((error) =>
          console.log("Something went wrong getting data for the first period")
        );

      this.reports = { ...this.reports, isLoading: true };
      Promise.all(
        baseURLs.map((i) =>
          this._http
            .post<{ report: IReport[] }>(i, {
              time_start: startDate2,
              time_end: endDate2,
              level: "segments",
              format: "per-hour",
            })
            .toPromise()
        )
      )
        .then((response) => {
          let reports = response.map((r) => r.report);
          // Filtered reports
          let targetReports: IReport[] = reports[0];
          let impactReports: IReport[] = reports
            .splice(1)
            .reduce((a, b) => [...a, ...b], []);

          this.reports = {
            ...this.reports,
            isLoading: false,
            secondPeriod: {
              target: targetReports,
              impact: impactReports,
            },
          };
        })
        .catch((error) =>
          console.log("Something went wrong getting data for the second period")
        );
    }
  }

  // Weather
  private readonly _weather = new BehaviorSubject<any>(null);
  readonly weather$ = this._weather.asObservable();

  get weather(): IWeather[] {
    return this._weather.getValue();
  }

  set weather(val: IWeather[]) {
    this._weather.next(val);
  }

  getWeather() {
    this._http
      .get<IWeather[]>(`${environment.baseURL}/api/weather`)
      .toPromise()
      .then((response) => {
        const period = this.periods[0];
        let filteredWeather = response.filter((w) => {
          let date = new Date(w.createdAt);
          let startDate = new Date(period.range[0]);
          let endDate = new Date(period.range[1]);
          return moment(date).isBetween(startDate, endDate, "d", "[]");
        });
        this.weather = filteredWeather;
      })
      .catch((error) => console.log(error));
  }

  getWeatherBetween(start: number, end: number) {
    this._http
      .get<IWeather[]>(`${environment.baseURL}/api/weather/${start}/${end}`)
      .toPromise()
      .then((response) => {
        this.weather = response;
      })
      .catch((error) => console.log(error));
  }

  // Weeks difference between two periods
  setWeekDifference() {
    if (this.periods.length === 2) {
      const p1 = this.periods[0];
      const p2 = this.periods[1];
      this._cookie.set(
        "totalDaysDiff",
        Math.ceil(
          Math.abs(
            moment(p1.range[0])
              .tz("Europe/Brussels")
              .diff(p2.range[0], "days", true)
          )
        ).toString()
      );
    }
  }
}
