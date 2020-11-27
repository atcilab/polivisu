import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import { RouterModule, Routes } from "@angular/router";
import {
  SidebarModule,
  NgxBootstrapModule,
  SpinnerModule,
} from "src/app/shared/components";
import { OverviewComponent } from "./views/overview/overview.component";
import { LightboxModule } from "ngx-lightbox";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "overview", component: OverviewComponent },
      {
        path: "users",
        loadChildren: () => import("./views").then((m) => m.UsersModule),
      },
      {
        path: "projects",
        loadChildren: () => import("./views").then((m) => m.ProjectsModule),
      },
      { path: "", redirectTo: "overview", pathMatch: "full" },
      { path: "**", redirectTo: "overview", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SidebarModule,
    NgxBootstrapModule,
    LightboxModule,
    SpinnerModule,
  ],
  declarations: [AdminComponent],
  exports: [AdminComponent],
})
export class AdminModule {}
