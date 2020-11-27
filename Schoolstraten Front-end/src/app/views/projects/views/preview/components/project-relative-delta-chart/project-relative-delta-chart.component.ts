import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { IProject, IReportStore, IReport, IDay } from "src/app/shared/models";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, Color } from "ng2-charts";
import { Subscription } from "rxjs";
import { ProjectDataService } from "../../services/projectData.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment-timezone";
import * as screenfull from "screenfull";
import * as _ from "lodash";
import { isActiveHour, fixReports, checkReports } from "src/app/shared/helpers";
import { chartOptions } from "src/app/shared/constants";

@Component({
  selector: "project-relative-delta-chart",
  templateUrl: "./project-relative-delta-chart.component.html",
  styleUrls: ["./project-relative-delta-chart.component.scss"],
})
export class ProjectRelativeDeltaChartComponent implements OnInit, OnDestroy {
  @ViewChild("deltaRelativeChart") deltaRelativeChart: HTMLElement;
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input() set project(val: IProject) {
    this._project = val;
  }
  rawData: Partial<IReport>[];
  lineChartData: ChartDataSets[] = [{ data: [], label: "None", hidden: true }];
  lineChartLabels: Label[] = [];
  lineChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "bottom",
      fullWidth: true,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: (val, i, values) => {
              const hour = (moment(val, "ddd D/M h a").hour() % 12) - 1;
              // return moment(val, "ddd D/M h a").format(`ddd [${hour}-]h a`);
              return moment(val, "ddd D/M h a").format(`ddd h a`);
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            callback: (value, index, values) => {
              return `${value} %`;
            },
          },
        },
      ],
    },
    tooltips: {
      mode: "index",
      position: "nearest",
      callbacks: {
        title: ([key, value], data) => {
          const hour = (moment(value.label, "ddd D/M h a").hour() % 12) - 1;
          // return moment(value.label, "ddd D/M h a").format(`ddd [${hour}-]h a`);
          return moment(value.label, "ddd D/M h a").format(`ddd h a`);
        },
        label: (item, data) => {
          const label = data.datasets[item.datasetIndex].label;
          const val = data.datasets[item.datasetIndex].data[item.index];
          return ` ${label}: ${val}%`;
        },
      },
    },
  };
  lineChartColors: Color[] = [
    {
      borderColor: "#dbcd4f",
      pointBackgroundColor: "#dbcd4f",
      pointBorderColor: "#dbcd4f",
    },
    {
      borderColor: "#e9e195",
      pointBackgroundColor: "#e9e195",
      pointBorderColor: "#e9e195",
    },
    {
      borderColor: "#cc4368",
      pointBackgroundColor: "#cc4368",
      pointBorderColor: "#cc4368",
    },
    {
      borderColor: "#e08ea4",
      pointBackgroundColor: "#e08ea4",
      pointBorderColor: "#e08ea4",
    },
    {
      borderColor: "#4ac3ff",
      pointBackgroundColor: "#4ac3ff",
      pointBorderColor: "#4ac3ff",
    },
    {
      borderColor: "#d1edff",
      pointBackgroundColor: "#d1edff",
      pointBorderColor: "#d1edff",
    },
    {
      borderColor: "#7c43e6",
      pointBackgroundColor: "#7c43e6",
      pointBorderColor: "#7c43e6",
    },
    {
      borderColor: "#dcb8fc",
      pointBackgroundColor: "#dcb8fc",
      pointBorderColor: "#dcb8fc",
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [
    {
      afterDraw: (chart) => {
        let datasets = chart.data.datasets;
        let data = _(datasets).map("data").flatMap().value();

        if (data.length === 0) {
          // No data is present
          var ctx = chart.ctx;
          var width = chart.width;
          var height = chart.height;

          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "16px normal 'Helvetica Nueue'";
          ctx.fillText("No data to display", width / 2, height / 2);

          ctx.restore();
        }
      },
    },
  ];
  subscription: Subscription[] = [];
  constructor(
    private _pdService: ProjectDataService,
    private _translate: TranslateService
  ) {
    moment.tz.setDefault("Etc/UTC");
  }

  ngOnInit() {
    let reports: IReportStore;
    let reportSub = this._pdService.reports$.subscribe((response) => {
      if (!response.isLoading && this.project) {
        reports = response;
        this.calculateData(reports, this.project);
      }
    });

    let translateSub = this._translate.onLangChange.subscribe(
      (res: { lang: string; translations: any }) => {
        if (reports && this.project) {
          moment.locale(res.lang.split("-")[0]);
          this.calculateData(reports, this.project);
        }
      }
    );

    this.subscription.push(reportSub, translateSub);
  }

  ngOnDestroy() {
    this.subscription.forEach((s) => s.unsubscribe());
  }

  calculateData(reports: IReportStore, project: IProject) {
    let days = project.activeHoursPerDay;
    if (!this._pdService.hasSecondPeriod) return;

    this.getRawData(days);

    // Target reports
    let aTargetRerports = _(isActiveHour(reports.firstPeriod.target, days))
      .groupBy("date")
      .map((date) =>
        date.reduce(
          (a, b) => ({
            pedestrian: a.pedestrian + b.pedestrian,
            bike: a.bike + b.bike,
            car: a.car + b.car,
            lorry: a.lorry + b.lorry,
            date: b.date,
          }),
          { pedestrian: 0, bike: 0, car: 0, lorry: 0, date: "" }
        )
      )
      .value();
    let bTargetReports = _(isActiveHour(reports.secondPeriod.target, days))
      .groupBy("date")
      .map((date) =>
        date.reduce(
          (a, b) => ({
            pedestrian: a.pedestrian + b.pedestrian,
            bike: a.bike + b.bike,
            car: a.car + b.car,
            lorry: a.lorry + b.lorry,
            date: b.date,
          }),
          { pedestrian: 0, bike: 0, car: 0, lorry: 0, date: "" }
        )
      )
      .value();
    // Impact reports
    let aImpactReports = _(isActiveHour(reports.firstPeriod.impact, days))
      .groupBy("date")
      .map((date) =>
        date.reduce(
          (a, b) => ({
            pedestrian: a.pedestrian + b.pedestrian,
            bike: a.bike + b.bike,
            car: a.car + b.car,
            lorry: a.lorry + b.lorry,
            date: b.date,
          }),
          { pedestrian: 0, bike: 0, car: 0, lorry: 0, date: "" }
        )
      )
      .value();
    let bImpactReports = _(isActiveHour(reports.secondPeriod.impact, days))
      .groupBy("date")
      .map((date) =>
        date.reduce(
          (a, b) => ({
            pedestrian: a.pedestrian + b.pedestrian,
            bike: a.bike + b.bike,
            car: a.car + b.car,
            lorry: a.lorry + b.lorry,
            date: b.date,
          }),
          { pedestrian: 0, bike: 0, car: 0, lorry: 0, date: "" }
        )
      )
      .value();

    if (!_.isEmpty(aTargetRerports) && !_.isEmpty(bTargetReports)) {
      const targetReports = checkReports(aTargetRerports, bTargetReports);
      aTargetRerports = targetReports.aReports;
      bTargetReports = targetReports.bReports;
      const impactReports = checkReports(aImpactReports, bImpactReports);
      aImpactReports = impactReports.aReports;
      bImpactReports = impactReports.bReports;
    }

    // Target Datasets
    let pedTargetLine: ChartDataSets = {
      data: this.getDifference(
        aTargetRerports.map((r) => r.pedestrian),
        bTargetReports.map((r) => r.pedestrian)
      ),
      label: this._translate.instant("preview.charts.pedTarget"),
      fill: false,
      hidden: true,
    };
    let bikeTargetLine: ChartDataSets = {
      data: this.getDifference(
        aTargetRerports.map((r) => r.bike),
        bTargetReports.map((r) => r.bike)
      ),
      label: this._translate.instant("preview.charts.bikeTarget"),
      fill: false,
    };
    let carTargetLine: ChartDataSets = {
      data: this.getDifference(
        aTargetRerports.map((r) => r.car),
        bTargetReports.map((r) => r.car)
      ),
      label: this._translate.instant("preview.charts.carTarget"),
      fill: false,
    };
    let lorryTargetLine: ChartDataSets = {
      data: this.getDifference(
        aTargetRerports.map((r) => r.lorry),
        bTargetReports.map((r) => r.lorry)
      ),
      label: this._translate.instant("preview.charts.lorryTarget"),
      fill: false,
      hidden: true,
    };

    // Impact Datasets
    let pedImpactLine: ChartDataSets = {
      data: this.getDifference(
        aImpactReports.map((r) => r.pedestrian),
        bImpactReports.map((r) => r.pedestrian)
      ),
      label: this._translate.instant("preview.charts.pedImpact"),
      fill: false,
      hidden: true,
    };
    let bikeImpactLine: ChartDataSets = {
      data: this.getDifference(
        aImpactReports.map((r) => r.bike),
        bImpactReports.map((r) => r.bike)
      ),
      label: this._translate.instant("preview.charts.bikeImpact"),
      fill: false,
    };
    let carImpactLine: ChartDataSets = {
      data: this.getDifference(
        aImpactReports.map((r) => r.car),
        bImpactReports.map((r) => r.car)
      ),
      label: this._translate.instant("preview.charts.carImpact"),
      fill: false,
    };
    let lorryImpactLine: ChartDataSets = {
      data: this.getDifference(
        aImpactReports.map((r) => r.lorry),
        bImpactReports.map((r) => r.lorry)
      ),
      label: this._translate.instant("preview.charts.lorryImpact"),
      fill: false,
      hidden: true,
    };

    this.lineChartData = [
      pedTargetLine,
      pedImpactLine,
      bikeTargetLine,
      bikeImpactLine,
      carTargetLine,
      carImpactLine,
      lorryTargetLine,
      lorryImpactLine,
    ];
    this.lineChartLabels = aTargetRerports.map((r) =>
      moment(r.date).format("ddd D/M h a")
    );
  }

  getDifference(a: number[], b: number[]): number[] {
    return a.map((v, i) => {
      if (isNaN(v) || v === null) return NaN;
      return parseFloat((((v - b[i]) / b[i]) * 100).toFixed(2));
    });
  }

  getRawData(days: IDay[]) {
    const aTargetReports = isActiveHour(
      this._pdService.reports.firstPeriod.target,
      days
    );
    const bTargetReports = isActiveHour(
      this._pdService.reports.secondPeriod.target,
      days
    );
    const aImpactReports = isActiveHour(
      this._pdService.reports.firstPeriod.impact,
      days
    );
    const bImpactReports = isActiveHour(
      this._pdService.reports.secondPeriod.impact,
      days
    );
    this.rawData = [
      ...aTargetReports,
      ...aImpactReports,
      ...bTargetReports,
      ...bImpactReports,
    ];
  }
}
