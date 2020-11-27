import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectReportsComponent } from "./project-reports.component";
import { ObjectReportModule } from "../object-report/object-report.module";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "src/app/shared/translation.module";
import { ToCsvModule, DropdownMenuModule } from "src/app/shared/components";

@NgModule({
  imports: [
    CommonModule,
    ObjectReportModule,
    FormsModule,
    TranslationModule,
    ToCsvModule,
    DropdownMenuModule,
  ],
  declarations: [ProjectReportsComponent],
  exports: [ProjectReportsComponent],
})
export class ProjectReportsModule {}
