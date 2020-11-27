import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ObjectReportComponent } from "./object-report.component";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";
import { PipesModule } from "src/app/shared/pipes/pipes.module";

@NgModule({
  imports: [CommonModule, FormsModule, TranslationModule, PipesModule],
  declarations: [ObjectReportComponent],
  exports: [ObjectReportComponent],
})
export class ObjectReportModule {}
