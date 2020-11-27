import { Component, OnInit } from "@angular/core";
import { IProjectCity } from "src/app/shared/models";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/shared/services/api.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-city-modal",
  templateUrl: "./city-modal.component.html",
  styleUrls: ["./city-modal.component.scss"],
})
export class CityModalComponent implements OnInit {
  title: string;
  submitText: string;
  isEdit: boolean = false;
  private _city: IProjectCity;
  set city(val: IProjectCity) {
    if (!val) return;
    this._city = val;

    this.updateForm.patchValue({
      cityName: val.cityName,
    });
  }
  get city(): IProjectCity {
    return this._city;
  }

  cityForm: FormGroup = new FormGroup({
    cityName: new FormControl("", [Validators.required]),
    file: new FormControl("", [Validators.required]),
    fileSource: new FormControl("", [Validators.required]),
  });

  updateForm: FormGroup = new FormGroup({
    cityName: new FormControl("", [Validators.required]),
    file: new FormControl(""),
    fileSource: new FormControl(""),
  });

  // Getters
  get cityName() {
    return this.cityForm.get("cityName");
  }

  get file() {
    return this.cityForm.get("file");
  }

  get fileSoruce() {
    return this.cityForm.get("fileSource");
  }

  get uCityName() {
    return this.updateForm.get("cityName");
  }

  get uFile() {
    return this.updateForm.get("file");
  }

  get uFileSource() {
    return this.updateForm.get("fileSource");
  }

  // Show error
  hasError(val: AbstractControl) {
    return (val.dirty || val.touched) && val.invalid && val.errors.required;
  }

  public static onClose: Subject<boolean> = new Subject();
  constructor(
    private _bsModalRef: BsModalRef,
    private _api: ApiService,
    public loader: LoaderService
  ) {}

  ngOnInit() {}

  onClose() {
    this._bsModalRef.hide();
    CityModalComponent.onClose.next(false);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.cityForm.patchValue({
        fileSource: file,
      });
    }
  }

  onFileUpdateChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.updateForm.patchValue({
        fileSource: file,
      });
    }
  }

  async onSubmit() {
    this.loader.isLoading = true;
    const cityParams = { cityName: this.cityName.value, cityLogo: "" };

    try {
      // Here the city is being created
      const {
        city: createdCity,
        message: createdMessage,
      } = await this._api.addCity(cityParams).toPromise();

      try {
        // Here the city's image is being uploading to the server
        const { imageURL } = await this._api
          .addCityImage(this.fileSoruce.value)
          .toPromise();

        try {
          // Here the city is being updated
          const updatedParams: IProjectCity = { cityLogo: imageURL };
          const {
            city: updatedCity,
            message: updatedMessage,
          } = await this._api
            .updateCity(createdCity._id, updatedParams)
            .toPromise();
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "success",
            title: createdMessage,
          });
          this._bsModalRef.hide();
          CityModalComponent.onClose.next(true);
          this.loader.isLoading = false;
        } catch (error) {
          console.log("Failed to update the city", { error });
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: "Failed to update the city",
          });
          this.loader.isLoading = false;
        }
      } catch (error) {
        console.log("Failed to upload the image", { error });
        Swal.fire({
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
          icon: "error",
          title: "Failed to upload the image",
        });
        this.loader.isLoading = false;
      }
    } catch (error) {
      console.log("Failed to create the city", { error });
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "error",
        title: "Failed to create city",
      });
      this.loader.isLoading = false;
    }
  }

  async onUpdate() {
    this.loader.isLoading = true;
    // Check if user added new image
    if (this.uFile.value) {
      // Check if city has image already
      if (this.city.cityLogo !== "") await this.onImageRemove(this.city, false);

      try {
        const { imageURL } = await this._api
          .addCityImage(this.uFileSource.value)
          .toPromise();
        const updatedCity: IProjectCity = {
          cityLogo: imageURL,
          cityName: this.uCityName.value,
        };
        try {
          const { city, message } = await this._api
            .updateCity(this.city._id, updatedCity)
            .toPromise();
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "success",
            title: message,
          });
          this._bsModalRef.hide();
          CityModalComponent.onClose.next(true);
          this.loader.isLoading = false;
        } catch (error) {
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: "Failed to update the city",
          });
          this.loader.isLoading = false;
        }
      } catch (error) {
        Swal.fire({
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
          icon: "success",
          title: "Failed to upload image",
        });
        this.loader.isLoading = false;
      }
    } else {
      try {
        const updatedCity: IProjectCity = { cityName: this.uCityName.value };
        const { city, message } = await this._api
          .updateCity(this.city._id, updatedCity)
          .toPromise();
        Swal.fire({
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
          icon: "success",
          title: message,
        });
        this._bsModalRef.hide();
        CityModalComponent.onClose.next(true);
        this.loader.isLoading = false;
      } catch (error) {
        Swal.fire({
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
          icon: "error",
          title: "Failed to update the city",
        });
        this.loader.isLoading = false;
      }
    }
  }

  async onImageRemove(val: IProjectCity, showSuccess: boolean = true) {
    try {
      const { city, message } = await this._api
        .removeCityImage(val)
        .toPromise();
      this.city = city;
      if (showSuccess) {
        Swal.fire({
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
          icon: "success",
          title: message,
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "error",
        title: "Failed to remove image",
      });
    }
  }
}
