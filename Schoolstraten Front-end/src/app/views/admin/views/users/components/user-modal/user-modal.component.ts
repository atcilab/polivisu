import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { IUser } from "src/app/shared/models";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ApiService } from "src/app/shared/services/api.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";

@Component({
  selector: "app-user-modal",
  templateUrl: "./user-modal.component.html",
  styleUrls: ["./user-modal.component.scss"],
})
export class UserModalComponent implements OnInit {
  public static onClose: Subject<boolean> = new Subject();
  private _user: IUser;
  set user(val: IUser) {
    if (!val) return;
    this._user = val;

    this.userForm.patchValue({
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email,
      role: val.role,
      isVerified: val.isVerified,
    });
  }
  get user(): IUser {
    return this._user;
  }

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.email, Validators.required]),
    role: new FormControl("", [Validators.required]),
    isVerified: new FormControl("", [Validators.required]),
  });

  // Getter
  get firstName() {
    return this.userForm.get("firstName");
  }

  get lastName() {
    return this.userForm.get("lastName");
  }

  get email() {
    return this.userForm.get("email");
  }

  get role() {
    return this.userForm.get("role");
  }

  get isVerified() {
    return this.userForm.get("isVerified");
  }

  // Show error
  hasError(val: AbstractControl, isEmail: boolean = false) {
    if (isEmail)
      return (val.dirty || val.touched) && val.invalid && val.errors.email;
    return (val.dirty || val.touched) && val.invalid && val.errors.required;
  }

  constructor(private _modal: BsModalRef, private _api: ApiService) {}

  ngOnInit(): void {}

  async onSubmit() {
    const { user, error, message } = await this._api
      .updateUser(this.user._id, this.userForm.value)
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
    else {
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "success",
        title: message,
      });

      UserModalComponent.onClose.next(true);
    }

    this.userForm.reset();
    this.user = null;
    this._modal.hide();
  }

  onModalClose() {
    this._modal.hide();
    UserModalComponent.onClose.next(false);
    this.user = null;
  }
}
