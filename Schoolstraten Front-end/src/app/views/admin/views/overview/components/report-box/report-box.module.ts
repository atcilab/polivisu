import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportBoxComponent } from "./report-box.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [ReportBoxComponent],
  exports: [ReportBoxComponent],
})
export class ReportBoxModule {}
