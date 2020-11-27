import { NgModule } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./token.interceptor";

@NgModule({
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  imports: [CommonModule],
})
export class AuthModule {}
