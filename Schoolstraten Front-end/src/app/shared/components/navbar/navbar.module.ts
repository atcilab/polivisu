import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar.component";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgxBootstrapModule } from "../ngx-bootstrap.module";

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule, NgxBootstrapModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
