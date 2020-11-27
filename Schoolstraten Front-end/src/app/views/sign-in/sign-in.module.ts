import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./sign-in.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FooterModule } from "src/app/shared/components";
import { TranslationModule } from "src/app/shared/translation.module";

const routes: Routes = [
  { path: "", pathMatch: "full", component: SignInComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    TranslationModule,
  ],
  declarations: [SignInComponent],
  exports: [SignInComponent],
})
export class SignInModule {}
