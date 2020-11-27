import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { AuthService } from "./services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this._auth.getJwtToken() && request.url.match(new RegExp("/api/"))) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this._auth.getJwtToken()}` },
      });
    }
    return next.handle(request);
  }
}
