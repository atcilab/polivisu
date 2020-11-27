import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker/";
import { TranslateService } from "@ngx-translate/core";
import { detectLanguage } from "src/app/shared/helpers";
import { IProject } from "src/app/shared/models";

@Component({
  selector: "information",
  templateUrl: "./information.component.html",
  styleUrls: ["./information.component.scss"],
})
export class InformationComponent implements OnInit {
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input()
  set project(val: IProject) {
    this._project = val;
    this.initialValues();
  }
  @Output("addressChange") addressChange: EventEmitter<
    string
  > = new EventEmitter();
  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: "theme-dark-blue",
    dateInputFormat: "DD/MM/YYYY",
  };
  infoGroup: FormGroup = new FormGroup({
    title: new FormControl("", { validators: [Validators.required] }),
    totalBikes: new FormControl(1, {
      validators: [Validators.required, Validators.min(1)],
    }),
    address: new FormControl(""),
    website: new FormControl("", {
      validators: [
        Validators.pattern(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        ),
      ],
    }),
    activationDate: new FormControl("", {
      validators: [Validators.required],
    }),
    isActive: new FormControl(0),
  });

  constructor(
    public validator: CreateProjectValidator,
    private localeService: BsLocaleService,
    private translate: TranslateService
  ) {
    this.localeService.use(detectLanguage());
    this.translate.onLangChange.subscribe((l) => {
      this.localeService.use(detectLanguage(l.lang));
    });
  }

  ngOnInit() {
    this.infoGroup.valueChanges.subscribe((s) => {
      this.validator.isInformationValid = this.infoGroup.valid;
      this.updateProject();
    });
  }

  hasError(control: AbstractControl) {
    return (
      (control.dirty || control.touched) &&
      control.invalid &&
      (control.errors.required || control.errors.pattern || control.errors.min)
    );
  }

  /* Getters */

  get title() {
    return this.infoGroup.get("title");
  }

  get totalBikes() {
    return this.infoGroup.get("totalBikes");
  }

  get address() {
    return this.infoGroup.get("address");
  }

  get website() {
    return this.infoGroup.get("website");
  }

  get activationDate() {
    return this.infoGroup.get("activationDate");
  }

  get isActive() {
    return this.infoGroup.get("isActive");
  }

  private updateProject() {
    this.validator.title = this.title.value;
    this.validator.numberOfBikes = this.totalBikes.value;
    this.validator.address = this.address.value;
    this.validator.website = this.website.value;
    this.validator.isActiveSince = this.activationDate.value;
    this.validator.isActive = this.isActive.value;
  }

  initialValues() {
    this.title.setValue(this.project.title);
    this.totalBikes.setValue(this.project.numberOfBikes);
    this.address.setValue(this.project.address);
    this.website.setValue(this.project.website);
    this.activationDate.setValue(new Date(this.project.isActiveSince));
    this.isActive.setValue(this.project.isActive);
  }

  onAddressChange() {
    if (this.address.value) this.addressChange.next(this.address.value);
  }

  onBlur() {
    if (this.website.value !== "") {
      const val = this.website.value;
      const pattern = new RegExp("^(https?:\\/\\/)");
      if (!pattern.test(val)) {
        this.website.patchValue(`http://${this.website.value}`);
      }
    }
  }
}
