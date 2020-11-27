import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RoadClosuresComponent } from "./road-closures.component";
import { ClosureModalModule } from "../closure-modal/closure-modal.module";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";
import { PipesModule } from "src/app/shared/pipes/pipes.module";

@NgModule({
  imports: [CommonModule, FormsModule, TranslationModule, PipesModule],
  declarations: [RoadClosuresComponent],
  exports: [RoadClosuresComponent],
  entryComponents: [ClosureModalModule]
})
export class RoadClosuresModule {}
