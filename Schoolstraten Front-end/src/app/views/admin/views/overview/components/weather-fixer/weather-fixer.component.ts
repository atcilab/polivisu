import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ValidateJSONType, toFormData } from "src/app/shared/helpers";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
@Component({
  selector: "weather-fixer",
  templateUrl: "./weather-fixer.component.html",
  styleUrls: ["./weather-fixer.component.scss"],
})
export class WeatherFixerComponent implements OnInit {
  weatherForm: FormGroup = new FormGroup({
    file: new FormControl(null, [Validators.required]),
    fileSource: new FormControl("", [Validators.required, ValidateJSONType]),
  });

  fileForm: FormGroup = new FormGroup({
    file: new FormControl(null, [Validators.required]),
  });

  constructor(private _http: HttpClient) {}

  ngOnInit() {}

  get file(): AbstractControl {
    return this.weatherForm.get("file");
  }

  get fileSource(): AbstractControl {
    return this.weatherForm.get("fileSource");
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.weatherForm.patchValue({ fileSource: file });
      this.fileForm.patchValue({ file });
    } else {
      this.fileForm.reset();
    }
  }

  submit() {
    const swal = Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      icon: "info",
      title: `<span class="fa fa-spin fa-spinner mr-2"></span>Uploading the file`,
      html: `Please do <span class="font-weight-bold text-uppercase">not</span> close the browser or the window.`,
    });

    this._http
      .post<{ message: string; totalAdditions: number; time: string }>(
        `${environment.baseURL}/api/weather/fix`,
        toFormData(this.fileForm.value)
      )
      .subscribe(
        (response) => {
          const { message } = response;
          this.weatherForm.reset();
          this.fileForm.reset();
          Swal.close();

          Swal.fire({
            icon: "success",
            title: "Uploading completed!",
            showConfirmButton: false,
            timer: 3000,
            html: message,
          });
        },
        (error) => {
          console.log({ error });
          this.weatherForm.reset();
          this.fileForm.reset();
          Swal.close();
          Swal.fire({
            toast: true,
            timer: 3500,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: "Something went wrong! Please try later",
          });
        }
      );
  }

  onReset() {
    this.weatherForm.reset();
    this.fileForm.reset();
  }
}
