import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClosureModalComponent } from "./closure-modal.component";
import { NgxBootstrapModule } from "src/app/shared/components";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";
import { PipesModule } from "src/app/shared/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
    TranslationModule,
    PipesModule
  ],
  declarations: [ClosureModalComponent],
  exports: [ClosureModalComponent]
})
export class ClosureModalModule {}
