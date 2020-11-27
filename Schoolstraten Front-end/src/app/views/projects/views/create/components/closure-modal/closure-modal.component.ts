import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { TimepickerConfig } from "ngx-bootstrap/timepicker";
import { getTimepickerConfig } from "src/app/shared/helpers";
import { IDay } from "src/app/shared/models";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import * as moment from "moment-timezone";

@Component({
  selector: "closure-modal",
  templateUrl: "./closure-modal.component.html",
  styleUrls: ["./closure-modal.component.scss"],
  providers: [{ provide: TimepickerConfig, useFactory: getTimepickerConfig }],
})
export class ClosureModalComponent implements OnInit {
  closuresForm: FormGroup;
  submitted: boolean = false;
  weekdaysArray: { value: number; text: string }[] = [
    { value: 1, text: "weekdays.monday" },
    { value: 2, text: "weekdays.tuesday" },
    { value: 3, text: "weekdays.wednesday" },
    { value: 4, text: "weekdays.thursday" },
    { value: 5, text: "weekdays.friday" },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    public validator: CreateProjectValidator
  ) {
    moment.tz.setDefault("Europe/Brussels");
    this.closuresForm = this.formBuilder.group({
      numberOfClosures: ["", Validators.required],
      closures: new FormArray([]),
      weekdays: ["", Validators.required],
    });
  }

  ngOnInit() {}

  /* Getters */
  get cf() {
    return this.closuresForm.controls;
  }
  get nc() {
    return this.cf.closures as FormArray;
  }

  onChangeClosures(e: any) {
    const numberOfClosures = e.target.value || 0;
    if (this.nc.length < numberOfClosures) {
      for (let i = this.nc.length; i < numberOfClosures; i++) {
        this.nc.push(
          this.formBuilder.group({
            start: new FormControl("", [Validators.required]),
            end: new FormControl("", [Validators.required]),
          })
        );
      }
    } else {
      for (let i = this.nc.length; i >= numberOfClosures; i--) {
        this.nc.removeAt(i);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.closuresForm.invalid) {
      return;
    }

    let weekdays: number[] = this.closuresForm.value.weekdays;
    let periods = this.nc.value.map((p) => ({
      // start: moment(p.start).add(1, "h").format("HH:mm"),
      // end: moment(p.end).add(1, "h").format("HH:mm"),
      start: moment(p.start).format("HH:mm"),
      end: moment(p.end).format("HH:mm"),
    }));
    let days: IDay[] = weekdays.map((d) => ({ weekday: d, periods }));

    // Check if any day already exists
    let existingDays = this.validator.activeHoursPerDay.map((x) => x.weekday);

    // Add active hours to project
    this.validator.addActiveHours(days);
    this.bsModalRef.hide();
  }
}
