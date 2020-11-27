import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropdownMenuComponent } from "./dropdown-menu.component";
import { FormsModule } from "@angular/forms";
import { TranslationModule } from "../../translation.module";

@NgModule({
  imports: [CommonModule, FormsModule, TranslationModule],
  declarations: [DropdownMenuComponent],
  exports: [DropdownMenuComponent],
})
export class DropdownMenuModule {}
