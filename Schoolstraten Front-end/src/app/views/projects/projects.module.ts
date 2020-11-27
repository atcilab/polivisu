import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard, RoleGuard } from "src/app/shared/guards";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./views/all/all.module").then((m) => m.AllModule),
  },
  {
    path: "create",
    loadChildren: () =>
      import("./views/create/create.module").then((m) => m.CreateModule),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: "edit/:id",
    loadChildren: () =>
      import("./views/edit/edit.module").then((m) => m.EditModule),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: ":id",
    loadChildren: () =>
      import("./views/no-dates/no-dates.module").then((m) => m.NoDatesModule),
  },
  {
    path: ":id/:start/:end",
    loadChildren: () =>
      import("./views/preview/preview.module").then((m) => m.PreviewModule),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [AuthGuard, RoleGuard],
})
export class ProjectsModule {}
