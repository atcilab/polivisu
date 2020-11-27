import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/shared/services/api.service";
import { IUser } from "src/app/shared/models";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { UserModalComponent } from "./components/user-modal/user-modal.component";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { LoaderService } from "src/app/shared/services/loader.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: IUser[];
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  isAsc: boolean = true;
  sortedBy: string = "role";
  constructor(
    private _api: ApiService,
    private _modal: BsModalService,
    private _loader: LoaderService,
    private _translate: TranslateService
  ) {}

  async ngOnInit() {
    const { users } = await this._api.getUsers().toPromise();
    this.users = users;

    const userModal$ = UserModalComponent.onClose.subscribe(async (success) => {
      if (success) {
        const { users } = await this._api.getUsers().toPromise();
        this.users = users;
      }
    });

    this.subscriptions.push(userModal$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public onEdit(val: IUser) {
    this.bsModalRef = this._modal.show(UserModalComponent, {
      initialState: { user: val },
      class: "modal-lg modal-dialog-centered",
    });
  }

  public onRemove(val: IUser) {
    Swal.fire({
      title: this._translate.instant("modals.title"),
      text: this._translate.instant("modals.text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this._translate.instant("modals.yes"),
      cancelButtonText: this._translate.instant("modals.no"),
    }).then(async (result) => {
      if (result.value) {
        const { message, error } = await this._api
          .deleteUser(val._id)
          .toPromise();
        if (error)
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: message,
          });
        else
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "success",
            title: message,
          });
        const { users } = await this._api.getUsers().toPromise();
        this.users = users;
      }
    });
  }

  sortBy(property: string) {
    this.sortedBy = property;
    this.isAsc = !this.isAsc;
    this.users = this.users.sort((a, b) => {
      return this.isAsc
        ? a[property] > b[property]
          ? 1
          : -1
        : a[property] < b[property]
        ? 1
        : -1;
    });
  }

  isSortedBy(property: string) {
    if (this.sortedBy === property) {
      return this.isAsc ? "fa-sort-up" : "fa-sort-down";
    } else {
      return "fa fa-sort";
    }
  }
}
