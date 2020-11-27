import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PieComponent } from "./pie.component";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";

@NgModule({
  imports: [CommonModule, FormsModule, ChartsModule],
  declarations: [PieComponent],
  exports: [PieComponent]
})
export class PieModule {}
