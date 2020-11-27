import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WeatherFixerComponent } from "./weather-fixer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [WeatherFixerComponent],
  exports: [WeatherFixerComponent],
})
export class WeatherFixerModule {}
