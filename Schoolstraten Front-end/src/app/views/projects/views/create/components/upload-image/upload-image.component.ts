import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ApiService } from "src/app/shared/services/api.service";
import { TranslateService } from "@ngx-translate/core";
import { Lightbox, IAlbum } from "ngx-lightbox";

@Component({
  selector: "upload-image",
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.scss"],
})
export class UploadImageComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("img") image: ElementRef;
  selectedFile: string;
  @Output("file") file: EventEmitter<File> = new EventEmitter();
  imgURL: any;
  constructor(
    private _api: ApiService,
    private _translate: TranslateService,
    private _lightbox: Lightbox
  ) {}

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = <File>event.target.files[0];
    this.selectedFile = file.name;
    this.file.emit(file);

    // Preview image
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  getText() {
    return this.selectedFile
      ? this.selectedFile
      : this._translate.instant("create.image.chooseFile");
  }

  removeImage() {
    this.selectedFile = null;
    this.file.emit(null);
    this.imgURL = null;
  }

  onUpload() {
    this.fileInput.nativeElement.click();
  }

  previewImage() {
    const src = this.image.nativeElement.src;
    const album: IAlbum[] = [{ src: src, thumb: src }];
    this._lightbox.open(album);
  }
}
