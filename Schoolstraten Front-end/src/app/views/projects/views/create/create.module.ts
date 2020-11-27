import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "./create.component";
import { RouterModule, Routes } from "@angular/router";
import {
  InformationModule,
  ActiveSegmentsModule,
  SegmentsModule,
  RoadClosuresModule,
  UploadImageModule,
} from "./components";
import { FooterModule, SpinnerModule } from "src/app/shared/components";
import { TranslationModule } from "src/app/shared/translation.module";

const routes: Routes = [
  {
    path: "",
    pathMatch: " full",
    component: CreateComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InformationModule,
    ActiveSegmentsModule,
    SegmentsModule,
    RoadClosuresModule,
    UploadImageModule,
    FooterModule,
    TranslationModule,
    SpinnerModule,
  ],
  declarations: [CreateComponent],
  exports: [CreateComponent],
})
export class CreateModule {}
