import { Component, OnInit, OnDestroy } from "@angular/core";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import { IRoadSegment } from "src/app/shared/models";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ProjectsService } from "src/app/shared/services/projects.service";
import { errorToast } from "src/app/shared/helpers";
import { TranslateService } from "@ngx-translate/core";
import { WatcherService } from "./services/watcher.service";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, OnDestroy {
  segment: IRoadSegment;
  file: File = null;
  isLoading: boolean = false;
  address: string;
  constructor(
    private _pService: ProjectsService,
    public validator: CreateProjectValidator,
    private _router: Router,
    private _translate: TranslateService,
    private _watcher: WatcherService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.validator.project = {
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

  onCancel() {
    Swal.fire({
      title: this._translate.instant("modals.title"),
      text: this._translate.instant("modals.text"),
      confirmButtonText: this._translate.instant("modals.yes"),
      cancelButtonText: this._translate.instant("modals.no"),
      showCancelButton: true,
      cancelButtonColor: "#d33",
      icon: "warning",
    }).then((response) => {
      if (response.value) {
        this.validator.project = {
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
    const project = this.validator.project;
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

    // Image filepath
    let image: string;
    if (this.file) {
      try {
        this.isLoading = true;
        const file = await this._pService
          .uploadFile({ file: this.file })
          .toPromise();
        image = file.imageURL;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
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

    // Check whether the project should include the image or not
    const p = this.file ? { ...project, image: image } : { ...project };
    try {
      this.isLoading = true;
      const createdProject = await this._pService.createProject(p);
      this.isLoading = false;
      Swal.fire({
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
        icon: "success",
        title: "Project created!",
      });

      this._router.navigateByUrl("/");
    } catch (error) {
      this.isLoading = false;
      console.log("Error trying create the project");
      console.log({ error });
      Swal.fire({
        toast: true,
        position: "top-right",
        confirmButtonText: "close",
        icon: "error",
        title: "Something went wrong trying to create the project",
      });
    }
  }

  onFile(event: File) {
    this.file = event;
  }

  onAddress(event: string) {
    this.address = event;
  }
}
