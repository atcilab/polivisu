import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreviewComponent } from "./preview.component";
import { RouterModule, Routes } from "@angular/router";
import {
  NgxBootstrapModule,
  SpinnerModule,
  FooterModule,
} from "src/app/shared/components";
import { TranslationModule } from "src/app/shared/translation.module";
import {
  ProjectCameraMapModule,
  ProjectRoadNamesModule,
  ProjectPeriodSelectorModule,
  ProjectReportsModule,
  BicyclesChartModule,
  TrafficEvolutionChartModule,
  ObjectDetailedChartModule,
  PieChartsModule,
  ObjectDetailedMirrorChartModule,
  ProjectSubPeriodSelectorModule,
  ProjectAbsoluteDeltaChartModule,
  ProjectRelativeDeltaChartModule,
} from "./components";

const routes: Routes = [
  { path: "", pathMatch: "full", component: PreviewComponent },
];

@NgModule({
  imports: [
    CommonModule,
    TranslationModule,
    RouterModule.forChild(routes),
    NgxBootstrapModule,
    ProjectCameraMapModule,
    ProjectRoadNamesModule,
    ProjectPeriodSelectorModule,
    ProjectReportsModule,
    BicyclesChartModule,
    SpinnerModule,
    TrafficEvolutionChartModule,
    ObjectDetailedChartModule,
    PieChartsModule,
    ObjectDetailedMirrorChartModule,
    ProjectSubPeriodSelectorModule,
    ProjectAbsoluteDeltaChartModule,
    ProjectRelativeDeltaChartModule,
    FooterModule,
  ],
  declarations: [PreviewComponent],
  exports: [PreviewComponent],
})
export class PreviewModule {}
