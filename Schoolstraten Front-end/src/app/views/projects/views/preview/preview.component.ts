import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProjectsService } from "src/app/shared/services/projects.service";
import * as moment from "moment";
import { IProject } from "src/app/shared/models";
import { ActivatedRoute, Router } from "@angular/router";
import { errorToast } from "src/app/shared/helpers";
import { TranslateService } from "@ngx-translate/core";
import { ProjectDataService } from "./services/projectData.service";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { WatcherService } from "../create/services/watcher.service";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"],
})
export class PreviewComponent implements OnInit, OnDestroy {
  project: IProject;
  subscriptions: Subscription[] = [];
  constructor(
    private _pService: ProjectsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _translate: TranslateService,
    public _pdService: ProjectDataService,
    private _cookie: CookieService,
    private _watcher: WatcherService
  ) {}

  ngOnInit() {
    if (!this.hasValidDates()) {
      const start = this._cookie.get("start1");
      const end = this._cookie.get("end1");
      const id = this._activatedRoute.snapshot.paramMap.get("id");
      this._router.navigateByUrl(`/projects/${id}/${start}/${end}`);
    } else {
      const start = this._activatedRoute.snapshot.paramMap.get("start");
      const end = this._activatedRoute.snapshot.paramMap.get("end");
      this._cookie.set("start1", start);
      this._cookie.set("end1", end);

      let reportsSub = this._pService
        .getProject(this._activatedRoute.snapshot.paramMap.get("id"))
        .subscribe(
          (response) => {
            this.project = response.project;
            this._watcher.target = response.project.schoolStreetCamera;
          },
          (error) => {
            console.log(error);
          }
        );

      this.subscriptions.push(reportsSub);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private hasValidDates(): boolean {
    const start = moment(
      this._activatedRoute.snapshot.paramMap.get("start"),
      "YYYY-MM-DD",
      true
    ).isValid();
    const end = moment(
      this._activatedRoute.snapshot.paramMap.get("end"),
      "YYYY-MM-DD",
      true
    ).isValid();

    return start && end;
  }

  public getIsActiveText() {
    if (this.project.isActive) {
      return this._translate.instant("preview.isActive", {
        date: moment(this.project.isActiveSince).format("LL"),
      });
    } else {
      return this._translate.instant("preview.isNotActive");
    }
  }

  getImage(): string {
    return this.project.image !== ""
      ? `${environment.images}/${this.project.image}`
      : "assets/images/books.jpg";
  }
}
