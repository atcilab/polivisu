import { Injectable } from "@angular/core";
import { CanActivate, Router, CanLoad } from "@angular/router";
import { UserRole } from "../models";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private _authService: AuthService, private _router: Router) {}

  canLoad() {
    return this.canActivate();
  }

  canActivate(): boolean {
    const role: UserRole = this._authService.role;
    if (role === "admin") return true;
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
