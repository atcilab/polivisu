import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap, catchError, mapTo } from "rxjs/operators";
import { of, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import decode from "jwt-decode";
import { UserRole, IToken } from "../models";
import Swal from "sweetalert2";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly JWT_TOKEN = "JWT_TOKEN";

  // Observable to check user's state
  private readonly _isLogged = new BehaviorSubject<boolean>(null);
  public isLogged$ = this._isLogged.asObservable();
  get isLogged() {
    return this._isLogged.getValue();
  }

  set isLogged(val: boolean) {
    this._isLogged.next(val);
  }

  // Observable to check user's role
  private readonly _role = new BehaviorSubject<UserRole>("user");
  public role$ = this._role.asObservable();
  get role(): UserRole {
    return this._role.getValue();
  }

  set role(val: UserRole) {
    this._role.next(val);
  }

  constructor(private _http: HttpClient, private _router: Router) {
    this.isLogged = this.isLoggedIn();
  }

  loginUser(user: { email: string; password: string }) {
    return this._http
      .post<{ token: string }>(`${environment.baseURL}/api/user/login`, user)
      .pipe(
        tap((response) => this.doLoginUser(response)),
        mapTo(true),
        catchError((error) => of(false))
      );
  }

  doLoginUser(val: { token: string }) {
    localStorage.setItem(this.JWT_TOKEN, val.token);
    const { role } = this.decodeToken();
    this.isLogged = true;
    this.role = role;
  }

  doLogoutUser() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isLogged = false;
    this.role = "user";
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    if (this.getJwtToken()) {
      const { exp, role } = this.decodeToken();
      this.role = role;
      const experationDate: number = exp * 1000;
      const nowDate: number = new Date().getTime();
      if (nowDate > experationDate) {
        this.doLogoutUser();
        Swal.fire({
          icon: "info",
          title: "You session has expired.",
          toast: true,
          timer: 2500,
          position: "top-right",
          showConfirmButton: false,
        });
        this._router.navigateByUrl("sign-in");
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  isOwner(user: string) {
    if (this.getJwtToken()) {
      const { _id, role } = this.decodeToken();
      switch (role) {
        case "admin":
          return true;
        case "creator":
          return user === _id;
        default:
          return false;
      }
    } else return false;
  }

  register(user) {
    return this._http.post(`${environment.baseURL}/api/user/register`, user);
  }

  public decodeToken(): IToken {
    if (this.getJwtToken())
      return JSON.parse(window.atob(this.getJwtToken().split(".")[1]));
  }
}
