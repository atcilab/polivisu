import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { IProject } from "src/app/shared/models";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";
import { ProjectsService } from "src/app/shared/services/projects.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { environment } from "src/environments/environment";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "preview-project-card",
  templateUrl: "./preview-project-card.component.html",
  styleUrls: ["./preview-project-card.component.scss"],
})
export class PreviewProjectCardComponent {
  start: string = this._cookie.get("start1");
  end: string = this._cookie.get("end1");
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input("project") set project(val: IProject) {
    this._project = val;
  }

  @Output() onDeleted: EventEmitter<any> = new EventEmitter();
  constructor(
    private _cookie: CookieService,
    private _pService: ProjectsService,
    private _router: Router,
    private _authService: AuthService,
    private _translate: TranslateService
  ) {}

  openMaps() {
    return `https://maps.google.com/?q=${this.project.address.replace(
      " ",
      "+"
    )}`;
  }

  getUrl() {
    return `/projects/${this.project._id}/${this.start}/${this.end}`;
  }

  isOwner(): boolean {
    return this._authService.isOwner(this.project.user);
  }

  onDelete() {
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
          const deleted = await this._pService.deleteProject(this.project._id);
          if (deleted) {
            this.onDeleted.emit();
            Swal.fire({
              title: "Deleted!",
              text: deleted.message,
              icon: "success",
              timer: 2500,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          console.log(error);

          Swal.fire({
            title: "Something went wrong!",
            text: "Unable to delete project. Please try again later",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      }
    });
  }

  onEdit() {
    window.localStorage.setItem("project", JSON.stringify(this.project));
    this._router.navigate([`/projects/edit/${this.project._id}`]);
  }
}
