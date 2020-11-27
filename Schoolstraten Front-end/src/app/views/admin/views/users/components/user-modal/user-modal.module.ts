import { NgModule } from "@angular/core";
import { UserModalComponent } from "./user-modal.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
  declarations: [UserModalComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [UserModalComponent],
})
export class UserModalModule {}
