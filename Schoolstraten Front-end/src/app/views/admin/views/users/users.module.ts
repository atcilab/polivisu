import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersComponent } from "./users.component";
import { RouterModule, Routes } from "@angular/router";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { UserModalModule } from "./components/user-modal/user-modal.module";
import { UserModalComponent } from "./components/user-modal/user-modal.component";
import { TranslationModule } from "src/app/shared/translation.module";

const routes: Routes = [{ path: "", component: UsersComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule,
    UserModalModule,
    TranslationModule,
  ],
  declarations: [UsersComponent],
  exports: [UsersComponent],
  entryComponents: [UserModalComponent],
})
export class UsersModule {}
