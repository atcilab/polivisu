import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./footer.component";
import { TranslationModule } from "../../translation.module";

@NgModule({
  imports: [CommonModule, TranslationModule],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
