import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToCsvComponent } from "./to-csv.component";

@NgModule({
  imports: [CommonModule],
  declarations: [ToCsvComponent],
  exports: [ToCsvComponent],
})
export class ToCsvModule {}
