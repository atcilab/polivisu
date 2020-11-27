import { Component, OnInit, Input, ElementRef } from "@angular/core";
import { IReport } from "../../models";
import * as screenfull from "screenfull";
import { toCSV } from "../../helpers";

@Component({
  selector: "app-dropdown-menu",
  templateUrl: "./dropdown-menu.component.html",
  styleUrls: ["./dropdown-menu.component.scss"],
})
export class DropdownMenuComponent implements OnInit {
  private _hasInfo: boolean = true;
  @Input() set hasInfo(val: boolean) {
    this._hasInfo = val;
  }
  get hasInfo(): boolean {
    return this._hasInfo;
  }

  private _reports: IReport[];
  @Input() set reports(val: IReport[]) {
    if (val) this._reports = val;
  }
  get reports(): IReport[] {
    return this._reports;
  }

  private _element: HTMLElement;
  @Input() set element(val: HTMLElement) {
    if (val) this._element = val;
  }
  get element(): HTMLElement {
    return this._element;
  }
  constructor() {}

  ngOnInit() {}

  onDownload() {
    toCSV(this.reports);
  }

  onFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.request(this.element);
    }
  }
}
