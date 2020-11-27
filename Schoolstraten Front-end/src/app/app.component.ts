import { Component, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import * as moment from "moment";
import { AuthService } from "./shared/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy {
  constructor(
    private translate: TranslateService,
    private _cookie: CookieService,
    private _authService: AuthService
  ) {
    this._authService.isLogged = this._authService.isLoggedIn();
    this.translate.use("nl-BE");
    moment.locale("nl");
    this._cookie.set(
      "lang",
      "nl-BE",
      moment().add(1, "d").toDate(),
      "/",
      null,
      false,
      "Strict"
    );
    this._cookie.set(
      "start1",
      moment().subtract(1, "w").format("YYYY-MM-DD"),
      moment().add(1, "d").toDate(),
      "/",
      null,
      false,
      "Strict"
    );
    this._cookie.set(
      "end1",
      moment().format("YYYY-MM-DD"),
      moment().add(1, "d").toDate(),
      "/",
      null,
      false,
      "Strict"
    );
  }

  ngOnDestroy() {
    this._cookie.deleteAll();
  }
}
