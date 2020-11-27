import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveProjectIndicatorComponent } from "./active-project-indicator.component";
import { NgxBootstrapModule } from "../ngx-bootstrap.module";
import { TranslationModule } from "../../translation.module";

@NgModule({
  imports: [CommonModule, NgxBootstrapModule, TranslationModule],
  declarations: [ActiveProjectIndicatorComponent],
  exports: [ActiveProjectIndicatorComponent],
})
export class ActiveProjectIndicatorModule {}
