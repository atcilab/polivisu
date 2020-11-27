import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { ChartDataSets, ChartOptions } from "chart.js";
import {
  Label,
  Color,
  PluginServiceGlobalRegistrationAndOptions,
  BaseChartDirective,
} from "ng2-charts";
import * as moment from "moment-timezone";
import { chartOptions } from "src/app/shared/constants";
import { ProjectDataService } from "../../services/projectData.service";
import { IProject, IReport } from "src/app/shared/models";
import {
  isActiveHour,
  getWeatherItems,
  getWeatherIcon,
} from "src/app/shared/helpers";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

@Component({
  selector: "bicycles-chart",
  templateUrl: "./bicycles-chart.component.html",
  styleUrls: ["./bicycles-chart.component.scss"],
})
export class BicyclesChartComponent implements OnInit, OnDestroy {
  @ViewChild("bicycleChart") bicycleChart: HTMLElement;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input() set project(val: IProject) {
    this._project = val;
  }
  rawData: IReport[];
  lineChartData: ChartDataSets[] = [{ data: [], label: "None", hidden: true }];
  lineChartLabels: Label[] = [];
  lineChartOptions: ChartOptions = chartOptions;
  lineChartColors: Color[] = [
    {
      borderColor: "#cc4368",
      backgroundColor: "#cc4368",
    },
    {
      borderColor: "#2E8CEA",
      pointBackgroundColor: "#2E8CEA",
      pointBorderColor: "#2E8CEA",
    },
  ];
  lineChartLegend = true;
  lineChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [
    {
      afterDatasetDraw: (chart) => {
        const ctx = chart.ctx;
        const dataset = chart.getDatasetMeta(0);
        const xPositions = dataset.data.map((d) => d._model.x);
        const yPositions = dataset.data.map((d: any) => d._yScale.bottom);
        const widths = dataset.data.map((d: any) => d._model.width);
        const iconSize = 35;
        chart.data.labels.forEach((label: string, index) => {
          const isActiveSince = moment(this.project.isActiveSince).tz(
            "Europe/Brussels"
          );
          // const currentDate = moment(label, "ddd D/M h a").toDate();
          // const weatherItem = getWeatherItems(
          //   this._pdService.weather,
          //   currentDate
          // );
          const cDate = moment(label, "ddd D/M h a").toDate();
          const currentDate = Math.round(
            moment(label, "ddd D/M h a").toDate().getTime() / 1000
          );
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
    let reports;
    let reportSub = this._pdService.reports$.subscribe((response) => {
      if (!response.isLoading && this.project) {
        reports = response.firstPeriod.target;
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

  calculateData(reports: IReport[], project: IProject) {
    const totalBikes = this.project.numberOfBikes || 0;
    const days = this.project.activeHoursPerDay;
    let filtersReports = isActiveHour(reports, days);
    this.rawData = filtersReports;
    let bikesBar: ChartDataSets = {
      data: filtersReports.map((r) => r.bike),
      label: this._translate.instant(
        "preview.charts.bicycleChart.numberOfBikes"
      ),
      order: 2,
    };
    let targetLine: ChartDataSets = {
      data: Array(filtersReports.length).fill(totalBikes),
      fill: false,
      type: "line",
      label: this._translate.instant("preview.charts.bicycleChart.target"),
      order: 1,
    };
    this.lineChartData = [bikesBar, targetLine];
    this.lineChartLabels = filtersReports.map((r) =>
      moment(r.date).format("ddd D/M h a")
    );
  }
}
