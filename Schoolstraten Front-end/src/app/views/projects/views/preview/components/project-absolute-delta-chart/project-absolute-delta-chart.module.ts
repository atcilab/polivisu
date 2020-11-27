import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectAbsoluteDeltaChartComponent } from "./project-absolute-delta-chart.component";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { TranslationModule } from "src/app/shared/translation.module";
import { ToCsvModule, DropdownMenuModule } from "src/app/shared/components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    TranslationModule,
    ToCsvModule,
    DropdownMenuModule,
  ],
  declarations: [ProjectAbsoluteDeltaChartComponent],
  exports: [ProjectAbsoluteDeltaChartComponent],
})
export class ProjectAbsoluteDeltaChartModule {}
