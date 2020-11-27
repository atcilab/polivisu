import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BicyclesChartComponent } from "./bicycles-chart.component";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";
import { ChartsModule } from "ng2-charts";
import {
  NgxBootstrapModule,
  ToCsvModule,
  DropdownMenuModule,
} from "src/app/shared/components";
import { ActiveProjectIndicatorModule } from "src/app/shared/components/active-project-indicator/active-project-indicator.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslationModule,
    ChartsModule,
    NgxBootstrapModule,
    ActiveProjectIndicatorModule,
    ToCsvModule,
    DropdownMenuModule,
  ],
  declarations: [BicyclesChartComponent],
  exports: [BicyclesChartComponent],
})
export class BicyclesChartModule {}
