import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "./shared/guards";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/projects" },
  {
    path: "projects",
    loadChildren: () =>
      import("./views/projects/projects.module").then((m) => m.ProjectsModule),
  },
  {
    path: "sign-in",
    loadChildren: () =>
      import("./views/sign-in/sign-in.module").then((m) => m.SignInModule),
  },
  {
    path: "sign-out",
    loadChildren: () =>
      import("./views/sign-out/sign-out.module").then((m) => m.SignOutModule),
  },
  {
    path: "sign-up",
    loadChildren: () =>
      import("./views/sign-up/sign-up.module").then((m) => m.SignUpModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./views/admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  },
  {
    path: "**",
    redirectTo: "/projects",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AdminGuard],
})
export class AppRoutingModule {}
