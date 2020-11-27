import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
} from "@angular/core";
import * as screenfull from "screenfull";
import * as moment from "moment-timezone";
import * as _ from "lodash";
import { IProject, IReport, IReportStore } from "src/app/shared/models";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, Color } from "ng2-charts";
import { chartOptions } from "src/app/shared/constants";
import { Subscription } from "rxjs";
import { ProjectDataService } from "../../services/projectData.service";
import { TranslateService } from "@ngx-translate/core";
import {
  isActiveHour,
  getWeatherItems,
  getWeatherIcon,
} from "src/app/shared/helpers";

@Component({
  selector: "traffic-evolution-chart",
  templateUrl: "./traffic-evolution-chart.component.html",
  styleUrls: ["./traffic-evolution-chart.component.scss"],
})
export class TrafficEvolutionChartComponent implements OnInit, OnDestroy {
  @ViewChild("evolutionChart") bicycleChart: HTMLElement;
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
      borderColor: "#DBCD4F",
      backgroundColor: "#DBCD4F",
      pointBorderColor: "#DBCD4F",
    },
    {
      borderColor: "#CC4368",
      pointBackgroundColor: "#CC4368",
      pointBorderColor: "#CC4368",
    },
    {
      borderColor: "#4AC3FF",
      pointBackgroundColor: "#4AC3FF",
      pointBorderColor: "#4AC3FF",
    },
    {
      borderColor: "#7C43E6",
      pointBackgroundColor: "#7C43E6",
      pointBorderColor: "#7C43E6",
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [
    {
      afterDatasetsDraw: (chart) => {
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
    let reportsByDate = _(
      isActiveHour(
        [...reports.firstPeriod.target, ...reports.firstPeriod.impact],
        days
      )
    )
      .groupBy("date")
      .value();

    this.rawData = isActiveHour(
      [...reports.firstPeriod.target, ...reports.firstPeriod.impact],
      days
    );

    let pedestrian = _(reportsByDate)
      .map((date) => date.reduce((a, b) => a + b.pedestrian, 0))
      .value();

    let bike = _(reportsByDate)
      .map((date) => date.reduce((a, b) => a + b.bike, 0))
      .value();

    let car = _(reportsByDate)
      .map((date) => date.reduce((a, b) => a + b.car, 0))
      .value();

    let lorry = _(reportsByDate)
      .map((date) => date.reduce((a, b) => a + b.lorry, 0))
      .value();

    // Datasets
    let pedLine: ChartDataSets = {
      data: pedestrian,
      label: this._translate.instant("preview.reportCard.pedestrian"),
      fill: false,
    };
    let bikeLine: ChartDataSets = {
      data: bike,
      label: this._translate.instant("preview.reportCard.bike"),
      fill: false,
    };
    let carLine: ChartDataSets = {
      data: car,
      label: this._translate.instant("preview.reportCard.car"),
      fill: false,
    };
    let lorryLine: ChartDataSets = {
      data: lorry,
      label: this._translate.instant("preview.reportCard.lorry"),
      fill: false,
    };

    this.lineChartData = [pedLine, bikeLine, carLine, lorryLine];
    this.lineChartLabels = _(reportsByDate)
      .keys()
      .map((k) => moment(k).format("ddd D/M h a"))
      .value();
  }
}
