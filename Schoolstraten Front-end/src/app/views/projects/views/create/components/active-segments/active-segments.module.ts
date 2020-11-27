import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveSegmentsComponent } from "./active-segments.component";
import { SpinnerModule } from "src/app/shared/components";

@NgModule({
  imports: [CommonModule, SpinnerModule],
  declarations: [ActiveSegmentsComponent],
  exports: [ActiveSegmentsComponent]
})
export class ActiveSegmentsModule {}
