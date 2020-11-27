import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CitiesReportsComponent } from "./cities-reports.component";

@NgModule({
  imports: [CommonModule],
  declarations: [CitiesReportsComponent],
  exports: [CitiesReportsComponent],
})
export class CitiesReportsModule {}
