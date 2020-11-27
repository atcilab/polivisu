import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectSubPeriodSelectorComponent } from "./project-sub-period-selector.component";
import { FormsModule } from "@angular/forms";
import { NgxBootstrapModule } from "src/app/shared/components";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [CommonModule, FormsModule, NgxBootstrapModule, TranslationModule],
  declarations: [ProjectSubPeriodSelectorComponent],
  exports: [ProjectSubPeriodSelectorComponent]
})
export class ProjectSubPeriodSelectorModule {}
