import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectRoadNamesComponent } from "./project-road-names.component";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [CommonModule, TranslationModule],
  declarations: [ProjectRoadNamesComponent],
  exports: [ProjectRoadNamesComponent],
})
export class ProjectRoadNamesModule {}
