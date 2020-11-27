import { NgModule } from "@angular/core";
import { CityModalComponent } from "./city-modal.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { SpinnerModule } from "src/app/shared/components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    SpinnerModule,
  ],
  declarations: [CityModalComponent],
  exports: [CityModalComponent],
})
export class CityModalModule {}
