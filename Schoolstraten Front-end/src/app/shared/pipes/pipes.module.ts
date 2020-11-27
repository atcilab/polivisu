import { NgModule } from "@angular/core";
import { MomentPipe } from "./moment.pipe";
import { KeysPipe } from "./keys.pipe";
import { CapitalizePipe } from "./capitalize.pipe";
import { NumberToArrayPipe } from "./numberToArray.pipe";
import { SplitPipe } from "./split.pipe";
import { SortByPipe } from "./sortBy.pipe";
import { NoCommaPipe } from "./noComma.pip";

@NgModule({
  declarations: [
    MomentPipe,
    KeysPipe,
    CapitalizePipe,
    NumberToArrayPipe,
    SplitPipe,
    SortByPipe,
    NoCommaPipe,
  ],
  exports: [
    MomentPipe,
    KeysPipe,
    CapitalizePipe,
    NumberToArrayPipe,
    SplitPipe,
    SortByPipe,
    NoCommaPipe,
  ],
  providers: [
    MomentPipe,
    KeysPipe,
    CapitalizePipe,
    NumberToArrayPipe,
    SplitPipe,
    SortByPipe,
    NoCommaPipe,
  ],
})
export class PipesModule {}
