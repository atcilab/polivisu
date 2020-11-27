import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ObjectDetailedChartComponent } from "./object-detailed-chart.component";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { TranslationModule } from "src/app/shared/translation.module";
import { ActiveProjectIndicatorModule } from "src/app/shared/components/active-project-indicator/active-project-indicator.module";
import { ToCsvModule, DropdownMenuModule } from "src/app/shared/components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    TranslationModule,
    ActiveProjectIndicatorModule,
    ToCsvModule,
    DropdownMenuModule,
  ],
  declarations: [ObjectDetailedChartComponent],
  exports: [ObjectDetailedChartComponent],
})
export class ObjectDetailedChartModule {}
