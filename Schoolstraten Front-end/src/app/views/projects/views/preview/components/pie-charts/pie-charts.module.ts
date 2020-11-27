import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PieChartsComponent } from "./pie-charts.component";
import { FormsModule } from "@angular/forms";
import { PieModule } from "../pie/pie.module";
import { TranslationModule } from "src/app/shared/translation.module";
import { ToCsvModule, DropdownMenuModule } from "src/app/shared/components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PieModule,
    TranslationModule,
    ToCsvModule,
    DropdownMenuModule,
  ],
  declarations: [PieChartsComponent],
  exports: [PieChartsComponent],
})
export class PieChartsModule {}
