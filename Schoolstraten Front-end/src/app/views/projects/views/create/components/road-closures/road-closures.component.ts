import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ClosureModalComponent } from "../closure-modal/closure-modal.component";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import { TranslateService } from "@ngx-translate/core";
import { IDay } from "src/app/shared/models";

@Component({
  selector: "road-closures",
  templateUrl: "./road-closures.component.html",
  styleUrls: ["./road-closures.component.scss"]
})
export class RoadClosuresComponent implements OnInit {
  bsModalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    public validator: CreateProjectValidator,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  onClick() {
    this.bsModalRef = this.modalService.show(ClosureModalComponent, {
      class: "modal-dialog modal-lg modal-dialog-centered"
    });
  }

  getWeekDay(val: number) {
    switch (val) {
      case 1:
        return this.translate.instant("weekdays.monday");
      case 2:
        return this.translate.instant("weekdays.tuesday");
      case 3:
        return this.translate.instant("weekdays.wednesday");
      case 4:
        return this.translate.instant("weekdays.thursday");
      case 5:
        return this.translate.instant("weekdays.friday");
      default:
        return "not valid week day";
    }
  }

  removeDay(day: IDay) {
    this.validator.removeActiveHour(day);
  }
}
