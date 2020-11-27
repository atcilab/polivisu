import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreviewProjectCardComponent } from "./preview-project-card.component";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { RouterModule } from "@angular/router";
import { NgxBootstrapModule } from "src/app/shared/components";
import { ImgFallbackDirective } from "src/app/shared/directives";

@NgModule({
  imports: [CommonModule, PipesModule, RouterModule, NgxBootstrapModule],
  declarations: [PreviewProjectCardComponent, ImgFallbackDirective],
  exports: [PreviewProjectCardComponent],
})
export class PreviewProjectCardModule {}
