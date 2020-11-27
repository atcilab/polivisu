import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InformationComponent } from "./information.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxBootstrapModule } from "src/app/shared/components";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
    TranslationModule,
  ],
  declarations: [InformationComponent],
  exports: [InformationComponent],
})
export class InformationModule {}
