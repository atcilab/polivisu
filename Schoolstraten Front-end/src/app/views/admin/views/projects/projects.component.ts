import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/shared/services/api.service";
import { pluck } from "rxjs/operators";
import { IProject, IUser } from "src/app/shared/models";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent implements OnInit {
  projects: IProject[];
  users: IUser[];
  isAsc: boolean = true;
  sortedBy: string = "title";
  constructor(
    private _api: ApiService,
    private _router: Router,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    this.getProjects();
  }

  async getProjects() {
    try {
      const { projects } = await this._api.getProjects().toPromise();
      const { users } = await this._api.getUsers().toPromise();
      this.projects = projects;
      this.users = users;
    } catch (error) {
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "error",
        title: "Failed to fetch projects",
      });
    }
  }

  getUser(id: string) {
    const user = this.users.find((u) => u._id === id);
    return `${user.firstName} ${user.lastName}`;
  }

  sortBy(property: string) {
    this.sortedBy = property;
    this.isAsc = !this.isAsc;
    this.projects = this.projects.sort((a, b) => {
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

  onEdit(project: IProject) {
    this._router.navigateByUrl(`/projects/edit/${project._id}`);
  }

  onRemove(project: IProject) {
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
        try {
          const { deleted, message } = await this._api
            .removeProject(project._id)
            .toPromise();
          await this.getProjects();
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "success",
            title: "Project deleted!",
          });
        } catch (error) {
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: "Something went wrong!",
          });
        }
      }
    });
  }
}
