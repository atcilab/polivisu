import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { IProject, IReport, IReportStore, IDay } from "src/app/shared/models";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, Color } from "ng2-charts";
import { chartOptions } from "src/app/shared/constants";
import { Subscription } from "rxjs";
import { ProjectDataService } from "../../services/projectData.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment-timezone";
import * as screenfull from "screenfull";
import * as _ from "lodash";
import {
  isActiveHour,
  getWeatherItems,
  getWeatherIcon,
} from "src/app/shared/helpers";

@Component({
  selector: "object-detailed-chart",
  templateUrl: "./object-detailed-chart.component.html",
  styleUrls: ["./object-detailed-chart.component.scss"],
})
export class ObjectDetailedChartComponent implements OnInit, OnDestroy {
  @ViewChild("objectChart") objectChart: HTMLElement;
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
  lineChartOptions: ChartOptions = { ...chartOptions };

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
      afterDatasetDraw: (chart) => {
        const ctx = chart.ctx;
        const dataset = chart.getDatasetMeta(0);
        const xPositions = dataset.data.map((d) => d._model.x);
        const yPositions = dataset.data.map((d: any) => d._yScale.bottom);
        const widths = dataset.data.map((d: any) => 12);
        const iconSize = 35;
        chart.data.labels.forEach((label: string, index) => {
          const isActiveSince = moment(this.project.isActiveSince).tz(
            "Europe/Brussels"
          );
          const currentDate = Math.round(
            moment(label, "ddd D/M h a").toDate().getTime() / 1000
          );
          const cDate = moment(label, "ddd D/M h a").toDate();
          const weatherItem = getWeatherItems(
            this._pdService.weather,
            currentDate
          );
          // Weather icon
          let icon = new Image();
          icon.src = getWeatherIcon(weatherItem);
          icon.onload = function () {
            let x = xPositions[index] - iconSize / 2;
            let y = 0;
            ctx.drawImage(icon, x, y, iconSize, iconSize);
          };
          // Active status indicator
          let startX = xPositions[index] - widths[index] / 2;
          let endX = xPositions[index] + widths[index] / 2;
          let startY = yPositions[index] + 2.5;
          ctx.strokeStyle = moment(cDate).isSameOrAfter(isActiveSince, "d")
            ? "#4caf50"
            : "#444444";
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, startY);
          ctx.lineWidth = 5;
          ctx.stroke();
        });
      },
    },
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
    if (!days) return;
    this.getRawData(days);

    let filteredTargetReports = _(
      isActiveHour(reports.firstPeriod.target, days)
    )
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
    let filteredImpactReports = _(
      isActiveHour(reports.firstPeriod.impact, days)
    )
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

    let sameDates = _.intersectionBy(
      filteredTargetReports,
      filteredImpactReports,
      "date"
    ).map((r) => r.date);

    // Intersection of the reports
    filteredTargetReports = filteredTargetReports.filter((r) =>
      sameDates.includes(r.date)
    );
    filteredImpactReports = filteredImpactReports.filter((r) =>
      sameDates.includes(r.date)
    );

    // Target data
    let pedTarget = _(filteredTargetReports).map("pedestrian").value();
    let bikeTarget = _(filteredTargetReports).map("bike").value();
    let carTarget = _(filteredTargetReports).map("car").value();
    let lorryTarget = _(filteredTargetReports).map("lorry").value();

    // Impact data
    let pedImpact = _(filteredImpactReports).map("pedestrian").value();
    let bikeImpact = _(filteredImpactReports).map("bike").value();
    let carImpact = _(filteredImpactReports).map("car").value();
    let lorryImpact = _(filteredImpactReports).map("lorry").value();

    // Datasets
    let pedTargetLine: ChartDataSets = {
      data: pedTarget,
      label: this._translate.instant("preview.charts.pedTarget"),
      fill: false,
    };
    let bikeTargetLine: ChartDataSets = {
      data: bikeTarget,
      label: this._translate.instant("preview.charts.bikeTarget"),
      fill: false,
    };
    let carTargetLine: ChartDataSets = {
      data: carTarget,
      label: this._translate.instant("preview.charts.carTarget"),
      fill: false,
      hidden: true,
    };
    let lorryTargetLine: ChartDataSets = {
      data: lorryTarget,
      label: this._translate.instant("preview.charts.lorryTarget"),
      fill: false,
      hidden: true,
    };

    let pedImpactLine: ChartDataSets = {
      data: pedImpact,
      label: this._translate.instant("preview.charts.pedImpact"),
      fill: false,
      hidden: true,
    };
    let bikeImpactLine: ChartDataSets = {
      data: bikeImpact,
      label: this._translate.instant("preview.charts.bikeImpact"),
      fill: false,
      hidden: true,
    };
    let carImpactLine: ChartDataSets = {
      data: carImpact,
      label: this._translate.instant("preview.charts.carImpact"),
      fill: false,
    };
    let lorryImpactLine: ChartDataSets = {
      data: lorryImpact,
      label: this._translate.instant("preview.charts.lorryImpact"),
      fill: false,
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
    this.lineChartLabels = sameDates.map((d) =>
      moment(d).format("ddd D/M h a")
    );
  }

  getRawData(days: IDay[]) {
    const targetReports = isActiveHour(
      this._pdService.reports.firstPeriod.target,
      days
    );
    const impactReports = isActiveHour(
      this._pdService.reports.firstPeriod.impact,
      days
    );
    this.rawData = [...targetReports, ...impactReports];
  }
}
