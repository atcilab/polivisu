import { Component, OnInit, Input, ViewChild, OnDestroy } from "@angular/core";
import { IProject, IReport } from "src/app/shared/models";
import * as _ from "lodash";
import { ProjectDataService } from "../../services/projectData.service";
import { Subscription } from "rxjs";
import { isActiveHour } from "src/app/shared/helpers";

@Component({
  selector: "pie-charts",
  templateUrl: "./pie-charts.component.html",
  styleUrls: ["./pie-charts.component.scss"],
})
export class PieChartsComponent implements OnInit, OnDestroy {
  @ViewChild("pieCharts") pieCharts: HTMLElement;
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input() set project(val: IProject) {
    this._project = val;
  }
  rawData: Partial<IReport>[];
  subscriptions: Subscription[] = [];
  constructor(public _pdService: ProjectDataService) {}

  ngOnInit() {
    let reports$ = this._pdService.reports$.subscribe((response) => {
      if (!response.isLoading && this.project) {
        if (
          response.secondPeriod &&
          (response.secondPeriod.target.length > 0 ||
            response.secondPeriod.impact.length > 0)
        ) {
          const days = this.project.activeHoursPerDay;
          const aTarget = isActiveHour(response.firstPeriod.target, days);
          const bTarget = isActiveHour(response.firstPeriod.impact, days);
          const aImpact = isActiveHour(response.firstPeriod.impact, days);
          const bImpact = isActiveHour(response.secondPeriod.impact, days);

          this.rawData = [...aTarget, ...aImpact, ...bTarget, ...bImpact];
        } else {
          const days = this.project.activeHoursPerDay;
          const aTarget = isActiveHour(response.firstPeriod.target, days);
          const aImpact = isActiveHour(response.firstPeriod.impact, days);
          this.rawData = [...aTarget, ...aImpact];
        }
      }
    });
    this.subscriptions.push(reports$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
