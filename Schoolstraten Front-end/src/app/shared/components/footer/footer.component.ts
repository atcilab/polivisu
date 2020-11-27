import { Component, OnDestroy, OnInit } from "@angular/core";
import { INavigationLink } from "../../models";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../services/api.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnDestroy, OnInit {
  shareLinks: INavigationLink[] = [];
  usefulLinks: INavigationLink[] = [];
  builtWith: INavigationLink[] = [];
  createdBy: INavigationLink[] = [];
  subscriptions: Subscription[] = [];

  constructor(private translate: TranslateService, private _api: ApiService) {
    this.getTranslatedValues();
    let translate$ = this.translate.onLangChange.subscribe((language) => {
      this.getTranslatedValues();
    });

    this.subscriptions.push(translate$);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public copyToClipboard(event: MouseEvent, str: string) {
    const noPage = "#";
    if (noPage === str) {
      event.preventDefault();
      const el = document.createElement("textarea");
      el.value = window.location.href;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      Swal.fire({
        toast: true,
        timer: 2500,
        position: "top-right",
        showConfirmButton: false,
        icon: "info",
        title: "Link copied",
      });
    }
  }

  private getTranslatedValues() {
    this.shareLinks = [
      {
        to: `https://twitter.com/home?status=${window.location.href}`,
        icon: "fab fa-lg fa-twitter",
      },
      {
        to: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
        icon: "fab fa-lg fa-facebook",
      },
      {
        to: `#`,
        icon: "fa fa-lg fa-link",
      },
    ];

    this.usefulLinks = [
      {
        to: "https://www.polivisu.eu/terms-of-use/#comp-k6tn4ujy",
        text: this.translate.instant("Terms of use"),
      },
      {
        to: "https://www.polivisu.eu/",
        text: this.translate.instant("Project website"),
      },
      {
        to: "https://www.polivisu.eu/#comp-joj5deqw",
        text: this.translate.instant("Contact"),
      },
      {
        to: "#",
        text: this.translate.instant("Built with"),
      },
    ];

    this.builtWith = [
      {
        to: "https://telraam-api.net/",
        text: "Telraam",
      },
      {
        to: "https://leafletjs.com/",
        text: "Leaflet",
      },
      {
        to: "https://www.openstreetmap.org/copyright",
        text: "OpenStreetMap",
      },
      {
        to: "https://carto.com/attribution/",
        text: "Carto",
      },
      {
        to: "https://openweathermap.org/",
        text: "OpenWeatherMap",
      },
    ];

    this.createdBy = [
      {
        to: "http://polivisu.eu/",
        icon: "assets/images/polivisu.png",
      },
      // {
      //   to: "https://www.atc.gr/",
      //   icon: "assets/images/atc.png",
      // },
    ];
  }
}
