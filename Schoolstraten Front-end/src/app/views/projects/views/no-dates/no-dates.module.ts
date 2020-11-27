import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoDatesComponent } from "./no-dates.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{ path: "", component: NoDatesComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [NoDatesComponent],
  exports: [NoDatesComponent],
})
export class NoDatesModule {}
