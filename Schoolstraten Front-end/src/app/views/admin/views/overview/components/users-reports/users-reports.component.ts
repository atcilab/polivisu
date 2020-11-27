import { Component, OnInit, Input } from "@angular/core";
import { IUser } from "src/app/shared/models";

@Component({
  selector: "u-reports",
  templateUrl: "./users-reports.component.html",
  styleUrls: ["./users-reports.component.scss"],
})
export class UsersReportsComponent implements OnInit {
  private _title: string;
  @Input("u-title") set title(val: string) {
    this._title = val;
  }
  get title(): string {
    return this._title;
  }

  private _users: IUser[];
  @Input("u-users") set users(val: IUser[]) {
    this._users = val;
  }
  get users(): IUser[] {
    return this._users;
  }

  private _navigate: string;
  @Input("navigate") set navigate(val: string) {
    this._navigate = val;
  }
  get navigate(): string {
    return this._navigate;
  }

  get admins(): number {
    if (!this.users) return 0;
    return this.users.filter((u) => u.role === "admin").length;
  }

  get creators(): number {
    if (!this.users) return 0;
    return this.users.filter((u) => u.role === "creator").length;
  }

  get basics(): number {
    if (!this.users) return 0;
    return this.users.filter((u) => u.role === "user").length;
  }

  constructor() {}

  ngOnInit() {}
}
