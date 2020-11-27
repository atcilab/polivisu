import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ChartType, ChartOptions } from "chart.js";
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  Color,
} from "ng2-charts";
import { IProject, IReport, IReportStore } from "src/app/shared/models";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { ProjectDataService } from "../../services/projectData.service";
import { isActiveHour } from "src/app/shared/helpers";
import * as _ from "lodash";

@Component({
  selector: "pie",
  templateUrl: "./pie.component.html",
  styleUrls: ["./pie.component.scss"],
})
export class PieComponent implements OnInit, OnDestroy {
  private _chartTitle: string;
  get chartTitle(): string {
    return this._chartTitle;
  }
  @Input() set chartTitle(val: string) {
    this._chartTitle = val;
  }

  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input() set project(val: IProject) {
    this._project = val;
  }

  private _hasSecondPeriod: boolean;
  get hasSecondPeriod(): boolean {
    return this._hasSecondPeriod;
  }
  @Input() set hasSecondPeriod(val: boolean) {
    this._hasSecondPeriod = val;
  }

  private _isTarget: boolean;
  get isTarget(): boolean {
    return this._isTarget;
  }
  @Input() set isTarget(val: boolean) {
    this._isTarget = val;
  }

  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.95,
    legend: {
      position: "bottom",
      fullWidth: true,
    },
    title: {
      padding: 15,
      display: true,
    },
    tooltips: {
      mode: "index",
      position: "nearest",
      callbacks: {
        label: (tooltipItem, data) => {
          let label: string = data.labels[tooltipItem.index].toString();

          let sum: number =
            Math.round(
              +[...data.datasets[0].data].reduce(
                (total: number, current: number) => total + current,
                0
              ) * 100
            ) / 100;

          let value: number =
            Math.round(
              +data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] *
                100
            ) / 100;

          let pct: number = Math.round((value / sum) * 100 * 100) / 100;
          return `${label}: ${pct}%`;
        },
      },
    },
  };
  pieChartColors: Color[] = [
    {
      backgroundColor: ["#dbcd4f", "#cc4368", "#4ac3ff", "#7c43e6"],
    },
  ];
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [10, 34, 5, 45];
  pieChartType: ChartType = "pie";
  pieChartLegend = true;
  pieChartPlugins = [
    {
      afterDraw: (chart) => {
        let datasets = chart.data.datasets;
        let data = _(datasets).map("data").flatMap().value();
        let sum = data.reduce((a, b) => a + b, 0);

        if (data.length === 0 || sum === 0) {
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
  subscriptions: Subscription[] = [];
  constructor(
    private _translate: TranslateService,
    private _pdService: ProjectDataService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.getTranslatedText();
    let reports: IReportStore;
    let reportsSub = this._pdService.reports$.subscribe((response) => {
      if (!response.isLoading && this.project) {
        reports = response;
        this.calculateData(reports, this.project);
      }
    });

    let translateSub = this._translate.onLangChange.subscribe((lang) => {
      this.getTranslatedText();
      this.calculateData(reports, this.project);
    });

    this.subscriptions.push(translateSub, reportsSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getTranslatedText() {
    this.pieChartOptions.title = {
      ...this.pieChartOptions.title,
      text: this._translate.instant(this.chartTitle),
    };

    let pedestrian = this._translate.instant("preview.reportCard.pedestrian");
    let bike = this._translate.instant("preview.reportCard.bike");
    let car = this._translate.instant("preview.reportCard.car");
    let lorry = this._translate.instant("preview.reportCard.lorry");

    this.pieChartLabels = [pedestrian, bike, car, lorry];
  }

  calculateData(reports: IReportStore, project: IProject) {
    let days = project.activeHoursPerDay;
    if (!this.hasSecondPeriod) {
      let filteredTargetReports: IReport[] = isActiveHour(
        reports.firstPeriod.target,
        days
      );
      let filteredImpactReports: IReport[] = isActiveHour(
        reports.firstPeriod.impact,
        days
      );
      // First Period
      if (this.isTarget) {
        // Is school street
        let pedestrian = filteredTargetReports.reduce(
          (a, b) => a + b.pedestrian,
          0
        );
        let bike = filteredTargetReports.reduce((a, b) => a + b.bike, 0);
        let car = filteredTargetReports.reduce((a, b) => a + b.car, 0);
        let lorry = filteredTargetReports.reduce((a, b) => a + b.lorry, 0);
        this.pieChartData = [pedestrian, bike, car, lorry];
      } else {
        // Is neighbouring streets
        let pedestrian = filteredImpactReports.reduce(
          (a, b) => a + b.pedestrian,
          0
        );
        let bike = filteredImpactReports.reduce((a, b) => a + b.bike, 0);
        let car = filteredImpactReports.reduce((a, b) => a + b.car, 0);
        let lorry = filteredImpactReports.reduce((a, b) => a + b.lorry, 0);
        this.pieChartData = [pedestrian, bike, car, lorry];
      }
    } else {
      let filteredTargetReports: IReport[] = isActiveHour(
        reports.secondPeriod.target,
        days
      );
      let filteredImpactReports: IReport[] = isActiveHour(
        reports.secondPeriod.impact,
        days
      );
      // Second period
      if (this.isTarget) {
        // Is school street
        let pedestrian = filteredTargetReports.reduce(
          (a, b) => a + b.pedestrian,
          0
        );
        let bike = filteredTargetReports.reduce((a, b) => a + b.bike, 0);
        let car = filteredTargetReports.reduce((a, b) => a + b.car, 0);
        let lorry = filteredTargetReports.reduce((a, b) => a + b.lorry, 0);
        this.pieChartData = [pedestrian, bike, car, lorry];
      } else {
        // Is neighbouring streets
        let pedestrian = filteredImpactReports.reduce(
          (a, b) => a + b.pedestrian,
          0
        );
        let bike = filteredImpactReports.reduce((a, b) => a + b.bike, 0);
        let car = filteredImpactReports.reduce((a, b) => a + b.car, 0);
        let lorry = filteredImpactReports.reduce((a, b) => a + b.lorry, 0);
        this.pieChartData = [pedestrian, bike, car, lorry];
      }
    }
  }
}
