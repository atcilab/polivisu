import { Component, OnInit, OnDestroy } from "@angular/core";
import { v4 } from "uuid";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CityModalComponent } from "../city-modal/city-modal.component";
import { Subscription, timer } from "rxjs";
import { IProjectCity } from "src/app/shared/models";
import { ApiService } from "src/app/shared/services/api.service";
import Swal from "sweetalert2";
import { Lightbox, IAlbum } from "ngx-lightbox";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "c-reports",
  templateUrl: "./cities-reports.component.html",
  styleUrls: ["./cities-reports.component.scss"],
})
export class CitiesReportsComponent implements OnInit, OnDestroy {
  bsModalRef: BsModalRef;
  cities: IProjectCity[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    private _modal: BsModalService,
    private _api: ApiService,
    private _lightbox: Lightbox,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    const modal$ = CityModalComponent.onClose.subscribe((res) => {
      if (res) this.getCities();
    });

    this.getCities();

    this.subscriptions.push(modal$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async getCities() {
    try {
      const { cities } = await this._api.getCities().toPromise();
      this.cities = cities;
    } catch (error) {
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "error",
        title: "Failed to fetch cities",
      });
    }
  }

  onAddCity() {
    this.bsModalRef = this._modal.show(CityModalComponent, {
      class: "modal-lg modal-dialog-centered",
      initialState: {
        title: "Add city",
        submitText: "Add city",
      },
    });
  }

  imagePreview(val: IProjectCity) {
    const album: IAlbum[] = [
      { src: val.cityLogo, caption: val.cityName, thumb: val.cityLogo },
    ];
    this._lightbox.open(album);
  }

  onEdit(val: IProjectCity) {
    this.bsModalRef = this._modal.show(CityModalComponent, {
      class: "modal-lg modal-dialog-centered",
      initialState: {
        title: "Updated city",
        submitText: "Update city",
        isEdit: true,
        city: val,
      },
    });
  }

  onRemove(val: IProjectCity) {
    Swal.fire({
      title: this._translate.instant("modals.title"),
      text: this._translate.instant("modals.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this._translate.instant("modals.yes"),
    }).then(async (result) => {
      if (result.value) {
        try {
          const { message } = await this._api.removeCity(val._id).toPromise();
          this.getCities();
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "success",
            title: message,
          });
        } catch (error) {
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: "Failed to delete city",
          });
        }
      }
    });
  }
}
