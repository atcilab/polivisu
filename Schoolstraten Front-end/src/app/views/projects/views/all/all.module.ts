import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AllComponent } from "./all.component";
import { RouterModule, Routes } from "@angular/router";
import {
  MessageModule,
  CreatePorjectCardModule,
  PreviewProjectCardModule,
  ActiveSegmentsMapModule,
} from "./components";
import { SpinnerModule, FooterModule } from "src/app/shared/components";

const routes: Routes = [{ path: "", component: AllComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MessageModule,
    CreatePorjectCardModule,
    PreviewProjectCardModule,
    ActiveSegmentsMapModule,
    SpinnerModule,
    FooterModule,
  ],
  declarations: [AllComponent],
  exports: [AllComponent],
})
export class AllModule {}
