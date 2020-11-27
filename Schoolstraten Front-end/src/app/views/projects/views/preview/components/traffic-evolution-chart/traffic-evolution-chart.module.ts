import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TrafficEvolutionChartComponent } from "./traffic-evolution-chart.component";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";
import { ChartsModule } from "ng2-charts";
import { ActiveProjectIndicatorModule } from "src/app/shared/components/active-project-indicator/active-project-indicator.module";
import { ToCsvModule, DropdownMenuModule } from "src/app/shared/components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslationModule,
    ChartsModule,
    ActiveProjectIndicatorModule,
    ToCsvModule,
    DropdownMenuModule,
  ],
  declarations: [TrafficEvolutionChartComponent],
  exports: [TrafficEvolutionChartComponent],
})
export class TrafficEvolutionChartModule {}
