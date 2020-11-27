import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ProjectDataService } from "../../services/projectData.service";
import { IReport, IObject } from "src/app/shared/models";
import { Subscription } from "rxjs";

@Component({
  selector: "project-reports",
  templateUrl: "./project-reports.component.html",
  styleUrls: ["./project-reports.component.scss"],
})
export class ProjectReportsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  pedestrian: IObject;
  bike: IObject;
  car: IObject;
  lorry: IObject;
  selected: "1" | "2" | "3" = "1";
  reports;
  rawData: Partial<IReport>[];
  @ViewChild("reportsCard") reportsCard: HTMLElement;
  constructor(private _pdService: ProjectDataService) {
    this.subscription = this._pdService.reports$.subscribe((s) => {
      if (!s.isLoading) {
        this.getReports();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getReports(category: "1" | "2" | "3" = "1"): void {
    /**
     * 1 -> All streets
     * 2 -> School street only
     * 3 -> Neighbouring streets only
     */
    if (category === "1") {
      let reports = [
        ...this._pdService.reports.firstPeriod.target,
        ...this._pdService.reports.firstPeriod.impact,
      ];
      this.reports = reports;
      let { pedestrian, bike, car, lorry, total } = this.calculateReports(
        reports
      );
      this.pedestrian = { type: "pedestrian", report: pedestrian, total };
      this.bike = { type: "bike", report: bike, total };
      this.car = { type: "car", report: car, total };
      this.lorry = { type: "lorry", report: lorry, total };
    } else if (category === "2") {
      let reports = [...this._pdService.reports.firstPeriod.target];
      this.reports = reports;
      let { pedestrian, bike, car, lorry, total } = this.calculateReports(
        reports
      );
      this.pedestrian = { type: "pedestrian", report: pedestrian, total };
      this.bike = { type: "bike", report: bike, total };
      this.car = { type: "car", report: car, total };
      this.lorry = { type: "lorry", report: lorry, total };
    } else if (category === "3") {
      let reports = [...this._pdService.reports.firstPeriod.impact];
      this.reports = reports;
      let { pedestrian, bike, car, lorry, total } = this.calculateReports(
        reports
      );
      this.pedestrian = { type: "pedestrian", report: pedestrian, total };
      this.bike = { type: "bike", report: bike, total };
      this.car = { type: "car", report: car, total };
      this.lorry = { type: "lorry", report: lorry, total };
    }
  }

  calculateReports(reports: IReport[]) {
    let pedestrian = reports.reduce((a, b) => a + b.pedestrian, 0);
    let bike = reports.reduce((a, b) => a + b.bike, 0);
    let car = reports.reduce((a, b) => a + b.car, 0);
    let lorry = reports.reduce((a, b) => a + b.lorry, 0);
    let total = pedestrian + bike + car + lorry;
    return { pedestrian, bike, car, lorry, total };
  }

  onChangeCategory(val: "1" | "2" | "3") {
    this.selected = val;
    this.getReports(val);
  }
}
