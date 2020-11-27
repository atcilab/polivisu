import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UploadImageComponent } from "./upload-image.component";
import { TranslationModule } from "src/app/shared/translation.module";
import { LightboxModule } from "ngx-lightbox";

@NgModule({
  imports: [CommonModule, TranslationModule, LightboxModule],
  declarations: [UploadImageComponent],
  exports: [UploadImageComponent],
})
export class UploadImageModule {}
