import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IProject, IRoadSegment, IDay } from "../models";

@Injectable({ providedIn: "root" })
export class CreateProjectValidator {
  constructor() {}

  /* Information form validation */
  private readonly _isInformationValid = new BehaviorSubject<boolean>(false);
  public isInformationValid$ = this._isInformationValid.asObservable();

  get isInformationValid() {
    return this._isInformationValid.getValue();
  }

  set isInformationValid(val: boolean) {
    this._isInformationValid.next(val);
  }

  /* Whole form validation */
  private readonly _isValid = new BehaviorSubject<boolean>(false);
  public isValid$ = this._isInformationValid.asObservable();

  get isValid() {
    return this._isValid.getValue();
  }

  set isValid(val: boolean) {
    this._isValid.next(val);
  }

  private readonly _project = new BehaviorSubject<IProject>({
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
  });

  public project$ = this._project.asObservable();

  /* Setter, Getter */
  get project() {
    return this._project.getValue();
  }

  set project(val: IProject) {
    this._project.next(val);
  }

  /* Setters */
  set title(val: string) {
    this.project = { ...this.project, title: val };
  }

  set address(val: string) {
    this.project = { ...this.project, address: val };
  }

  set website(val: string) {
    this.project = { ...this.project, website: val };
  }

  set isActiveSince(val: Date) {
    this.project = { ...this.project, isActiveSince: val };
  }

  set isActive(val: boolean) {
    this.project = { ...this.project, isActive: val };
  }

  set schoolStreetCamera(val: IRoadSegment) {
    this.project = { ...this.project, schoolStreetCamera: val };
  }

  set neighbouringStreetCameras(val: IRoadSegment[]) {
    this.project = { ...this.project, neighbouringStreetCameras: val };
  }

  set roadName(val: IRoadSegment) {
    this.project = {
      ...this.project,
      roadNames: [...this.project.roadNames, val],
    };
  }

  set numberOfBikes(val: number) {
    this.project = { ...this.project, numberOfBikes: val };
  }

  set activeHoursPerDay(val: IDay[]) {
    this.project = { ...this.project, activeHoursPerDay: val };
  }

  set image(val: string) {
    this.project = { ...this.project, image: val };
  }

  /* Getters */

  get roadNames() {
    return this.project.roadNames;
  }

  get activeHoursPerDay(): IDay[] {
    return this.project.activeHoursPerDay;
  }

  addActiveHours(val: IDay | IDay[]) {
    if (Array.isArray(val)) {
      this.project.activeHoursPerDay = [
        ...this.project.activeHoursPerDay,
        ...val,
      ];
    } else {
      this.project.activeHoursPerDay = [...this.project.activeHoursPerDay, val];
    }

    this.project.activeHoursPerDay = this.project.activeHoursPerDay.sort(
      (a, b) => a.weekday - b.weekday
    );
  }

  removeActiveHour(val: IDay) {
    this.project.activeHoursPerDay = this.project.activeHoursPerDay.filter(
      (a) => a.weekday !== val.weekday
    );
  }

  removeRroadName(val: IRoadSegment) {
    this.project.roadNames = this.project.roadNames.filter(
      (r) => r.id !== val.id
    );
  }
}
