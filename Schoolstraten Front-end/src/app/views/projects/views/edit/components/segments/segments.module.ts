import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SegmentsComponent } from "./segments.component";
import { NgxBootstrapModule, SpinnerModule } from "src/app/shared/components";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxBootstrapModule,
    SpinnerModule,
    TranslationModule,
  ],
  declarations: [SegmentsComponent],
  exports: [SegmentsComponent],
})
export class SegmentsModule {}
