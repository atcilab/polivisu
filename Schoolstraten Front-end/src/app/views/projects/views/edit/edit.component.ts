import { Component, OnInit, OnDestroy } from "@angular/core";
import { IProject, IRoadSegment } from "src/app/shared/models";
import { ProjectsService } from "src/app/shared/services/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import { errorToast } from "src/app/shared/helpers";
import { AuthService } from "src/app/shared/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { WatcherService } from "../create/services/watcher.service";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit, OnDestroy {
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  set project(val: IProject) {
    this._project = val;
    this._watcher.target = val.schoolStreetCamera;
  }
  file: File = null;
  isLoading: boolean = true;
  segment: IRoadSegment;
  address: string;
  constructor(
    private _pService: ProjectsService,
    private _validator: CreateProjectValidator,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private _translate: TranslateService,
    private _watcher: WatcherService
  ) {
    this.getProjectFromStore();
  }

  ngOnInit() {}

  ngOnDestroy() {
    localStorage.removeItem("project");
    this._validator.project = {
      title: "",
      address: "",
      website: "",
      isActiveSince: new Date(),
      isActive: false,
      schoolStreetCamera: null,
      neighbouringStreetCameras: [],
      roadNames: [],
      numberOfBikes: 0,
      activeHoursPerDay: [],
      image: null,
    };
    this._watcher.target = null;
  }

  async getProjectFromStore() {
    if (!localStorage.getItem("project")) {
      console.log("There is no project to edit");
      const id = this._activatedRoute.snapshot.paramMap.get("id");
      const prj = await this._pService.getProject(id).toPromise();
      this.project = prj.project;
    } else {
      this.project = JSON.parse(localStorage.getItem("project"));
    }

    // Check if user is owner
    if (!this.isOwner())
      Swal.fire({
        title: "Stop right there!",
        text: "You are not authorized to edit this project",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => this._router.navigate(["/"]));
    else {
      this.isLoading = false;
      this._validator.project = this.project;
    }
  }

  isOwner(): boolean {
    return this._authService.isOwner(this.project.user);
  }

  onCancel() {
    Swal.fire({
      title: this._translate.instant("modals.title"),
      text: this._translate.instant("modals.text"),
      confirmButtonText: this._translate.instant("modals.yes"),
      showCancelButton: true,
      cancelButtonText: this._translate.instant("modals.no"),
      cancelButtonColor: "#d33",
      icon: "warning",
    }).then((response) => {
      if (response.value) {
        this._validator.project = {
          title: "",
          address: "",
          website: "",
          isActiveSince: new Date(),
          isActive: false,
          schoolStreetCamera: null,
          neighbouringStreetCameras: [],
          roadNames: [],
          numberOfBikes: 0,
          activeHoursPerDay: [],
          image: null,
        };
        this._router.navigate(["/projects"]);
      }
    });
  }

  async onSave() {
    const project = this._validator.project;
    if (project.title === "") {
      errorToast({ title: "Title cannot be empty" });
      return;
    } else if (!project.isActiveSince) {
      errorToast({ title: "Activation date cannot be empty" });
      return;
    } else if (!project.schoolStreetCamera) {
      errorToast({ title: "You need to add a target school street" });
      return;
    } else if (project.neighbouringStreetCameras.length === 0) {
      errorToast({ title: "You need to add at least a neighbouring street" });
      return;
    } else if (project.activeHoursPerDay.length === 0) {
      errorToast({
        title: "You need to add one closure day for the school street",
      });
      return;
    }
    try {
      const updatedProject = await this._pService.updateProject(project);
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "success",
        title: "Project updated!",
      });

      this._router.navigateByUrl("/");
    } catch (error) {
      console.log("Error trying update the project");
      console.log({ error });
      Swal.fire({
        toast: true,
        position: "top-right",
        confirmButtonText: "close",
        icon: "error",
        title: "Something went wrong trying to update the project",
      });
    }
  }

  async onFileChange(event: File) {
    this.file = event;

    try {
      this.isLoading = true;
      const { imageURL } = await this._pService
        .uploadFile({ file: this.file })
        .toPromise();

      const updatedProject: IProject = { ...this.project, image: imageURL };
      const { updated } = await this._pService.updateProject(updatedProject);
      this.isLoading = false;
      this.project = updated;
    } catch (error) {
      Swal.fire({
        toast: true,
        timer: 2500,
        position: "top-right",
        showConfirmButton: false,
        icon: "error",
        title: error.error.message,
      });
      return;
    }
  }

  onAddress(event: string) {
    this.address = event;
  }
}
