import { NgModule } from "@angular/core";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SortableModule } from "ngx-bootstrap/sortable";
import { ModalModule } from "ngx-bootstrap/modal";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { nlBeLocale, enGbLocale, frLocale } from "ngx-bootstrap/locale";
import { defineLocale } from "ngx-bootstrap/chronos";

defineLocale("nlbe", nlBeLocale);
defineLocale("engb", enGbLocale);
defineLocale("fr", frLocale);

@NgModule({
  imports: [
    BsDatepickerModule.forRoot(),
    SortableModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    BsDatepickerModule,
    SortableModule,
    ModalModule,
    TimepickerModule,
    TooltipModule
  ]
})
export class NgxBootstrapModule {}
