import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreatePorjectCardComponent } from "./create-porject-card.component";
import { RouterModule } from "@angular/router";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [CommonModule, RouterModule, TranslationModule],
  declarations: [CreatePorjectCardComponent],
  exports: [CreatePorjectCardComponent]
})
export class CreatePorjectCardModule {}
