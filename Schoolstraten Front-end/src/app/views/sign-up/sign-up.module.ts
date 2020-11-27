import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignUpComponent } from "./sign-up.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FooterModule } from "src/app/shared/components";
import { TranslationModule } from "src/app/shared/translation.module";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FooterModule,
    TranslationModule,
  ],
  declarations: [SignUpComponent],
  exports: [SignUpComponent],
})
export class SignUpModule {}
