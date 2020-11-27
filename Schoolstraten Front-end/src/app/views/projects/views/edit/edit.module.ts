import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditComponent } from "./edit.component";
import { RouterModule, Routes } from "@angular/router";
import { SpinnerModule, FooterModule } from "src/app/shared/components";
import {
  InformationModule,
  ActiveSegmentsModule,
  SegmentsModule,
  RoadClosuresModule,
  UploadImageModule,
} from "./components";
import { TranslationModule } from "src/app/shared/translation.module";
import { LightboxModule } from "ngx-lightbox";

const routes: Routes = [
  { path: "", pathMatch: "full", component: EditComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    InformationModule,
    ActiveSegmentsModule,
    SegmentsModule,
    RoadClosuresModule,
    UploadImageModule,
    FooterModule,
    TranslationModule,
    LightboxModule,
  ],
  declarations: [EditComponent],
  exports: [EditComponent],
})
export class EditModule {}
