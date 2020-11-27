import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignOutComponent } from "./sign-out.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{ path: "", component: SignOutComponent }];
@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [SignOutComponent],
  exports: [SignOutComponent],
})
export class SignOutModule {}
