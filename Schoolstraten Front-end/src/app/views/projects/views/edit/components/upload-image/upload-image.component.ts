import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { IProject } from "src/app/shared/models";
import { ProjectsService } from "src/app/shared/services/projects.service";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import { TranslateService } from "@ngx-translate/core";
import { Lightbox, IAlbum } from "ngx-lightbox";
import Swal from "sweetalert2";

@Component({
  selector: "upload-image",
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.scss"],
})
export class UploadImageComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input() set project(val: IProject) {
    this._project = val;
  }

  selectedFile: File = null;
  @Output("file") file: EventEmitter<File> = new EventEmitter();
  constructor(
    private _pService: ProjectsService,
    public validator: CreateProjectValidator,
    private _translate: TranslateService,
    private _lightbox: Lightbox
  ) {}

  ngOnInit() {}

  async onFileSelected(event: any) {
    // this.selectedFile = <File>event.target.files[0];
    // this.file.emit(<File>event.target.files[0]);
    const image = <File>event.target.files[0];

    const { imageURL } = await this._pService
      .uploadFile({ file: image })
      .toPromise();
    const { updated } = await this._pService.updateProject({
      ...this.project,
      image: imageURL,
    });
    this.validator.image = imageURL;
    this.project = updated;
  }

  onPreview() {
    const album: IAlbum[] = [
      {
        src: this.project.image,
        caption: this.project.title,
        thumb: this.project.image,
      },
    ];
    this._lightbox.open(album);
  }

  onDelete() {
    this.selectedFile = null;
    this.file.emit(null);
  }

  onRemove() {
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
          const { message } = await this._pService
            .deleteImage(this.project._id, this.project.image)
            .toPromise();
          this.selectedFile = null;
          const { updated } = await this._pService.updateProject({
            ...this.project,
            image: "",
          });
          this.project = updated;
          this.validator.image = "";
          Swal.fire({
            toast: true,
            timer: 3000,
            position: "top-right",
            showConfirmButton: false,
            icon: "success",
            title: "Image deleted!",
          });
        } catch (error) {
          Swal.fire({
            toast: true,
            timer: 5000,
            position: "top-right",
            showConfirmButton: false,
            icon: "error",
            title: "Something went wrong trying to delete the image",
          });
        }
      }
    });
  }

  getText() {
    return this.selectedFile
      ? this.selectedFile.name
      : this._translate.instant("create.image.chooseFile");
  }

  onUpdate() {
    this.fileInput.nativeElement.click();
  }
}
