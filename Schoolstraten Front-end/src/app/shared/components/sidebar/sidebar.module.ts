import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./sidebar.component";
import { RouterModule } from "@angular/router";
import { TranslationModule } from "../../translation.module";

@NgModule({
  imports: [CommonModule, RouterModule, TranslationModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
