import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserRole } from "../models";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate() {
    const role: UserRole = this._authService.role;
    if (role === "creator" || role === "admin") return true;
    else {
      Swal.fire({
        toast: true,
        timer: 2500,
        position: "top-right",
        showConfirmButton: false,
        title: "You are not authorized to do this action",
        icon: "error",
      });
      this._router.navigateByUrl("/");
      return false;
    }
  }
}
