import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/shared/services/api.service";
import { IProject, IUser } from "src/app/shared/models";
import { pluck } from "rxjs/operators";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  private _projects: IProject[];
  set projects(val: IProject[]) {
    this._projects = val;
  }
  get projects(): IProject[] {
    return this._projects;
  }

  private _users: IUser[];
  set users(val: IUser[]) {
    this._users = val;
  }
  get users(): IUser[] {
    return this._users;
  }

  constructor(private _api: ApiService) {}

  ngOnInit() {
    this.getStats();
  }

  async getStats(): Promise<void> {
    const usersPromise = this._api.getUsers().pipe(pluck("users")).toPromise();
    const projectsPromise = this._api
      .getProjects()
      .pipe(pluck("projects"))
      .toPromise();

    const res = await Promise.all([projectsPromise, usersPromise]);
    this.projects = res[0] as IProject[];
    this.users = res[1] as IUser[];
  }
}
