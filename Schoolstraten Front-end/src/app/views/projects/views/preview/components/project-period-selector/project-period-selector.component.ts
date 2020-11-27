import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { TranslateService } from "@ngx-translate/core";
import { detectLanguage } from "src/app/shared/helpers";
import { CookieService } from "ngx-cookie-service";
import * as moment from "moment-timezone";
import { ProjectDataService } from "../../services/projectData.service";
import { Period } from "src/app/shared/models/period.model";
import { IProject } from "src/app/shared/models";
import { Router } from "@angular/router";

@Component({
  selector: "project-period-selector",
  templateUrl: "./project-period-selector.component.html",
  styleUrls: ["./project-period-selector.component.scss"],
})
export class ProjectPeriodSelectorComponent implements OnInit, OnDestroy {
  private _project: IProject;
  @Input() set project(val: IProject) {
    this._project = val;
  }

  get project(): IProject {
    return this._project;
  }

  range: Date[] = [
    moment(this._cookie.get("start1")).toDate(),
    moment(this._cookie.get("end1")).toDate(),
  ];
  period: Period = new Period(this.range);
  bsConfig: Partial<BsDatepickerConfig> = {
    adaptivePosition: true,
    containerClass: "theme-dark-blue",
    rangeInputFormat: "dddd DD MMMM YYYY",
    showWeekNumbers: false,
    maxDate: new Date(),
  };

  @Output() onAddPeriod: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private _localeService: BsLocaleService,
    private _translate: TranslateService,
    private _cookie: CookieService,
    public _pdService: ProjectDataService,
    private _router: Router
  ) {
    moment.tz.setDefault("Europe/Brussels");
    this._localeService.use(detectLanguage());
    this._translate.onLangChange.subscribe((l) => {
      this._localeService.use(detectLanguage(l.lang));
    });
  }

  ngOnInit() {
    this._pdService.addPeriod(this.period);
  }

  ngOnDestroy() {
    this._pdService.removePeriod(this.period);
  }

  public onValueChange(values: Date[]) {
    if (values && this.project) {
      let start = moment(values[0]).add(3, "hours");
      let end = moment(values[1]).add(3, "hours");
      this._cookie.set(
        "diff",
        end.diff(start, "days").toString(),
        moment().add(1, "d").toDate(),
        "/",
        null,
        false,
        "Strict"
      );

      this._cookie.set(
        "start1",
        moment(values[0]).add(3, "hours").format("YYYY-MM-DD"),
        moment().add(1, "d").toDate(),
        "/",
        null,
        false,
        "Strict"
      );
      this._cookie.set(
        "end1",
        moment(values[1]).add(3, "hours").format("YYYY-MM-DD"),
        moment().add(1, "d").toDate(),
        "/",
        null,
        false,
        "Strict"
      );
      this.period.range = values;
      this._pdService.hasSecondPeriod = false;
      this._pdService.getReports(
        this.project.schoolStreetCamera.id,
        this.project.neighbouringStreetCameras.map((x) => x.id)
      );
      // this._pdService.getWeather();
      const startTimeSeconds = Math.round(
        moment(values[0]).add(3, "h").startOf("day").toDate().getTime() / 1000
      );
      const endTimeSeconds = Math.round(
        moment(values[1]).add(3, "h").endOf("day").toDate().getTime() / 1000
      );
      this._pdService.getWeatherBetween(startTimeSeconds, endTimeSeconds);

      // Navigation
      const { _id } = this.project;
      const startTime = moment(values[0]).add(3, "hours").format("YYYY-MM-DD");
      const endTime = moment(values[1]).add(3, "hours").format("YYYY-MM-DD");
      this._router.navigateByUrl(`/projects/${_id}/${startTime}/${endTime}`);
    }
  }

  public onPeriod() {
    this._pdService.hasSecondPeriod = true;
  }
}
