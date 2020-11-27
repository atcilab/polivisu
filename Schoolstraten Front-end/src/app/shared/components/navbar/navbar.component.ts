import { Component } from "@angular/core";
import { INavigationLink, ILanguage, IReport } from "../../models";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import * as moment from "moment";
import { AuthService } from "../../services/auth.service";
import { Subscription, Observable } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ProjectDataService } from "src/app/views/projects/views/preview/services/projectData.service";
import { toCSV, isActiveHour } from "../../helpers";
import { ProjectsService } from "../../services/projects.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  availableLangs: ILanguage[] = [];
  navLinks: INavigationLink[] = [];
  authLinks: INavigationLink[] = [];
  subscriptions: Subscription[] = [];
  hasDownloadBtn: boolean = false;
  constructor(
    private _translate: TranslateService,
    private _cookie: CookieService,
    private _authService: AuthService,
    private _router: Router,
    private _location: Location,
    private _pdService: ProjectDataService,
    private _api: ProjectsService
  ) {
    const translate$ = this._translate.onLangChange.subscribe((language) => {
      this.availableLangs = [
        { text: this._translate.instant("navigation.nl"), value: "nl-BE" },
        { text: this._translate.instant("navigation.en"), value: "en-US" },
      ];

      const role$ = this._authService.role$.subscribe((role) => {
        switch (role) {
          case "user":
            this.navLinks = [];
            break;
          case "creator":
            this.navLinks = [
              {
                to: "/projects/create",
                text: this._translate.instant("navigation.createPorject"),
              },
            ];
            break;
          case "admin":
            this.navLinks = [
              {
                to: "/projects/create",
                text: this._translate.instant("navigation.createPorject"),
              },
              {
                to: "/admin",
                text: this._translate.instant("navigation.cpanel"),
              },
            ];
            break;
          default:
            this.navLinks = [];
            break;
        }
      });

      const isLogged$ = this._authService.isLogged$.subscribe((val) => {
        if (val)
          this.authLinks = [
            {
              to: "/sign-out",
              text: this._translate.instant("navigation.signOut"),
            },
          ];
        else
          this.authLinks = [
            {
              to: "/sign-in",
              text: this._translate.instant("navigation.signIn"),
            },
          ];
      });
      this.subscriptions.push(role$, isLogged$);
    });

    const route$ = this._router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const route = this._location.path();
        const regex = /\bprojects\/\b[a-zA-Z0-9]{24}/gm;
        if (route.match(regex)) this.hasDownloadBtn = true;
        else this.hasDownloadBtn = false;
      }
    });

    this.subscriptions.push(translate$, route$);
  }

  public setLanguage(lang: string) {
    this._translate.use(lang);
    this._cookie.set(
      "lang",
      lang,
      moment().add(1, "d").toDate(),
      "/",
      null,
      false,
      "Strict"
    );
    const locale = lang.split("-")[0];
    moment.locale(locale);
  }

  downloadRaw() {
    const target = this._pdService.reports.firstPeriod.target;
    const impact = this._pdService.reports.firstPeriod.impact;
    const target2 = this._pdService.reports.secondPeriod.target;
    const impact2 = this._pdService.reports.secondPeriod.impact;
    let reports: IReport[] = [];
    if (this._pdService.periods.length === 1) reports = [...target, ...impact];
    else reports = [...target, ...impact, ...target2, ...impact2];
    toCSV(reports);
  }

  async downloadFiltered() {
    try {
      const url = window.location.href;
      const regex = /\b[a-zA-Z0-9]{24}/gm;
      if (url.match(regex)) {
        const [id] = url.match(regex);
        let { project } = await this._api.getProject(id).toPromise();
        let days = project.activeHoursPerDay;
        const target = isActiveHour(
          this._pdService.reports.firstPeriod.target,
          days
        );
        const impact = isActiveHour(
          this._pdService.reports.firstPeriod.impact,
          days
        );
        const target2 = isActiveHour(
          this._pdService.reports.secondPeriod.target,
          days
        );
        const impact2 = isActiveHour(
          this._pdService.reports.secondPeriod.impact,
          days
        );
        let reports: IReport[] = [];
        if (this._pdService.periods.length === 1)
          reports = [...target, ...impact];
        else reports = [...target, ...impact, ...target2, ...impact2];
        toCSV(reports);
      } else {
        return;
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        timerProgressBar: true,
        icon: "error",
        title: "Unable to download the file",
      });
    }
  }
}
