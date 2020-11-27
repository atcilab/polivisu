import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UploadImageComponent } from "./upload-image.component";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [CommonModule, PipesModule, TranslationModule],
  declarations: [UploadImageComponent],
  exports: [UploadImageComponent],
})
export class UploadImageModule {}
