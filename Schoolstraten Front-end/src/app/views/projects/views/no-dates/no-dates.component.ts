import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import * as moment from "moment-timezone";

@Component({
  selector: "app-no-dates",
  templateUrl: "./no-dates.component.html",
  styleUrls: ["./no-dates.component.scss"],
})
export class NoDatesComponent {
  constructor(
    private _router: Router,
    private _cookie: CookieService,
    private _activatedRoute: ActivatedRoute
  ) {
    moment.tz.setDefault("Europe/Brussels");
    const start =
      this._cookie.get("start1") ||
      moment().subtract(1, "week").format("YYYY-MM-DD");
    const end = this._cookie.get("end1") || moment().format("YYYY-MM-DD");
    const id = this._activatedRoute.snapshot.paramMap.get("id");
    this._router.navigateByUrl(`/projects/${id}/${start}/${end}`);
  }
}
