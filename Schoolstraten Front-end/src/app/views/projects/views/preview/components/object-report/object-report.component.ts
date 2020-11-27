import { Component, OnInit, Input } from "@angular/core";
import { IObject } from "src/app/shared/models";

@Component({
  selector: "object-report",
  templateUrl: "./object-report.component.html",
  styleUrls: ["./object-report.component.scss"],
})
export class ObjectReportComponent implements OnInit {
  private _object: IObject;
  get object(): IObject {
    return this._object;
  }
  @Input() set object(val: IObject) {
    this._object = val;
  }

  constructor() {}

  ngOnInit() {}

  getImage() {
    switch (this.object.type) {
      case "pedestrian":
        return "assets/images/svg/001-walk.svg";
      case "bike":
        return "assets/images/svg/002-bicycle.svg";
      case "car":
        return "assets/images/svg/003-car.svg";
      case "lorry":
        return "assets/images/svg/004-lorry.svg";
      default:
        return "assets/images/svg/001-walk.svg";
    }
  }

  getText() {
    switch (this.object.type) {
      case "pedestrian":
        return "preview.reportCard.pedestrian";
      case "bike":
        return "preview.reportCard.bike";
      case "car":
        return "preview.reportCard.car";
      case "lorry":
        return "preview.reportCard.lorry";
      default:
        return "preview.reportCard.pedestrian";
    }
  }

  getPCT(): string {
    return this.object.report && this.object.total
      ? ((this.object.report / this.object.total) * 100).toFixed().concat("%")
      : "0%";
  }
}
