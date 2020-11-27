import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "r-box",
  templateUrl: "./report-box.component.html",
  styleUrls: ["./report-box.component.scss"],
})
export class ReportBoxComponent implements OnInit {
  private _src: string;
  @Input("src") set src(val: string) {
    this._src = val;
  }
  get src(): string {
    return this._src;
  }

  private _alt: string;
  @Input("alt") set alt(val: string) {
    this._alt = val;
  }
  get alt(): string {
    return this._alt;
  }

  private _reportTitle: string;
  @Input("report-title") set reportTitle(val: string) {
    this._reportTitle = val;
  }
  get reportTitle(): string {
    return this._reportTitle;
  }

  private _reportText: string;
  @Input("report-text") set reportText(val: string) {
    this._reportText = val;
  }
  get reportText(): string {
    return this._reportText;
  }

  private _reportValue: string;
  @Input("report-value") set reportValue(val: string) {
    this._reportValue = val;
  }
  get reportValue(): string {
    return this._reportValue;
  }

  constructor() {}

  ngOnInit() {}
}
