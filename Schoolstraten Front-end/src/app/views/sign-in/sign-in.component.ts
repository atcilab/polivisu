import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { errorAlert, successToast } from "src/app/shared/helpers";
import { AuthService } from "src/app/shared/services/auth.service";
import { tap } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", { validators: [Validators.required] }),
  });
  constructor(private _router: Router, private _authService: AuthService) {}

  ngOnInit() {}

  public onSubmit() {
    this._authService.loginUser(this.loginForm.value).subscribe((response) => {
      if (response) {
        this._router.navigate(["/projects"]);
        Swal.fire({
          toast: true,
          timer: 2500,
          position: "top-right",
          icon: "success",
          title: "Welcome!",
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          toast: true,
          timer: 2500,
          position: "top-right",
          title: "Wrong credentials",
          icon: "error",
          showConfirmButton: false,
        });
      }
    });
  }
}
