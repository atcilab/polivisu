import { Component, OnInit, Input } from "@angular/core";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { TranslateService } from "@ngx-translate/core";
import { detectLanguage } from "src/app/shared/helpers";
import { CookieService } from "ngx-cookie-service";
import * as moment from "moment-timezone";
import { ProjectDataService } from "../../services/projectData.service";
import { Period } from "src/app/shared/models/period.model";
import { IProject } from "src/app/shared/models";

@Component({
  selector: "project-sub-period-selector",
  templateUrl: "./project-sub-period-selector.component.html",
  styleUrls: ["./project-sub-period-selector.component.scss"],
})
export class ProjectSubPeriodSelectorComponent implements OnInit {
  private _project: IProject;
  @Input() set project(val: IProject) {
    this._project = val;
  }

  get project(): IProject {
    return this._project;
  }

  diff = parseInt(this._cookie.get("diff"));
  start: Date = moment(new Date(this._cookie.get("start1")))
    .subtract(1, "week")
    .toDate();
  end: Date = moment(new Date(this._cookie.get("end1")))
    .subtract(1, "week")
    .toDate();

  acceptedWeekday = moment(new Date(this._cookie.get("start1"))).day();

  period: Period = new Period([this.start, this.end]);
  bsConfig: Partial<BsDatepickerConfig> = {
    adaptivePosition: true,
    containerClass: "theme-dark-blue",
    dateInputFormat: "dddd DD MMMM YYYY",
    daysDisabled: [0, 1, 2, 3, 4, 5, 6].filter(
      (i) => i !== this.acceptedWeekday
    ),
    showWeekNumbers: false,
    maxDate: new Date(),
  };

  constructor(
    private _localeService: BsLocaleService,
    private _translate: TranslateService,
    private _cookie: CookieService,
    public pdService: ProjectDataService
  ) {
    moment.tz.setDefault("Europe/Brussels");
    this._localeService.use(detectLanguage());
    this._translate.onLangChange.subscribe((l) => {
      this._localeService.use(detectLanguage(l.lang));
    });
  }

  ngOnInit() {
    this.pdService.addPeriod(this.period);
  }

  ngOnDestroy() {
    this.pdService.removePeriod(this.period);
    this._cookie.delete("start2", "/", null, false, "Strict");
    this._cookie.delete("end2", "/", null, false, "Strict");
  }

  public onValueChange(value: Date) {
    if (value && this.project) {
      this.end = moment(value).add(this.diff, "d").toDate();
      this._cookie.set(
        "start2",
        moment(value).format("YYYY-MM-DD"),
        moment().add(1, "d").toDate(),
        "/",
        null,
        false,
        "Strict"
      );
      this._cookie.set(
        "end2",
        moment(this.end).format("YYYY-MM-DD"),
        moment().add(1, "d").toDate(),
        "/",
        null,
        false,
        "Strict"
      );
      this.period.range = [value, this.end];
      this.pdService.setWeekDifference();
      this.pdService.getReports(
        this.project.schoolStreetCamera.id,
        this.project.neighbouringStreetCameras.map((x) => x.id)
      );
    }
  }

  onPeriod() {
    this.pdService.hasSecondPeriod = false;
  }
}
