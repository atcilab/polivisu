import { Component } from "@angular/core";
import { AuthService } from "src/app/shared/services/auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-sign-out",
  templateUrl: "./sign-out.component.html",
  styleUrls: ["./sign-out.component.scss"],
})
export class SignOutComponent {
  constructor(private _auth: AuthService, private _router: Router) {
    this._auth.doLogoutUser();
    Swal.fire({
      toast: true,
      timer: 2500,
      position: "top-right",
      showConfirmButton: false,
      title: "Goodbye!",
    });
    setTimeout(() => {
      this._router.navigateByUrl("/");
    }, 250);
  }
}
