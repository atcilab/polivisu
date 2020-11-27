import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectReportsComponent } from "./project-reports.component";
import { FormsModule } from "@angular/forms";
import { ReportBoxModule } from "../report-box/report-box.module";
import { RouterModule } from "@angular/router";
import { TranslationModule } from "src/app/shared/translation.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportBoxModule,
    RouterModule,
    TranslationModule,
  ],
  declarations: [ProjectReportsComponent],
  exports: [ProjectReportsComponent],
})
export class ProjectReportsModule {}
