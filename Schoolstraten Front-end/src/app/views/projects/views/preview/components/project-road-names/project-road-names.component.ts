import { Component, OnInit, Input } from "@angular/core";
import { IProject } from "src/app/shared/models";
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "project-road-names",
  templateUrl: "./project-road-names.component.html",
  styleUrls: ["./project-road-names.component.scss"]
})
export class ProjectRoadNamesComponent implements OnInit {
  @Input() project: IProject;

  constructor(
    private _cookie: CookieService,
    private _translate: TranslateService
  ) {}

  ngOnInit() {}

  public getLink(id: string) {
    const start = this._cookie.get("start1");
    const end = this._cookie.get("end1");
    const lang = this._translate.currentLang.split("-")[0];

    return `https://telraam.net/${lang}/location/${id}/${start}/${end}`;
  }
}
