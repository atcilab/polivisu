import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverviewComponent } from "./overview.component";
import { RouterModule, Routes } from "@angular/router";
import {
  ProjectReportsModule,
  UsersReportsModule,
  CitiesReportsModule,
  WeatherFixerModule,
} from "./components";
import { TranslationModule } from "src/app/shared/translation.module";

const routes: Routes = [{ path: "", component: OverviewComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProjectReportsModule,
    UsersReportsModule,
    CitiesReportsModule,
    TranslationModule,
    WeatherFixerModule,
  ],
  declarations: [OverviewComponent],
  exports: [OverviewComponent],
})
export class OverviewModule {}
