import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { errorAlert, successAlert } from "src/app/shared/helpers";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl("", { validators: [Validators.required] }),
    lastName: new FormControl("", { validators: [Validators.required] }),
    email: new FormControl("", {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl("", {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  constructor(private router: Router, private _authService: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    this._authService.register(this.registerForm.value).subscribe(
      (s) => {
        if (s) {
          Swal.fire({
            title: "Registration completed!",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(["/sign-in"]);
          });
        }
      },
      (error) => {
        if (error.status === 409) {
          Swal.fire({
            title: "Email is already in use",
            timer: 2500,
            showConfirmButton: false,
            icon: "error",
          });
        }
      }
    );
  }

  /* Getter */
  get firstName() {
    return this.registerForm.get("firstName");
  }

  get lastName() {
    return this.registerForm.get("lastName");
  }

  get username() {
    return this.registerForm.get("username");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }
}
