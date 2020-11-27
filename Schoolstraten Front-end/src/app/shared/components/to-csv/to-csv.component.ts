import { Component, OnInit, Input } from "@angular/core";
import { IReport } from "src/app/shared/models";
import { toCSV } from "src/app/shared/helpers";

@Component({
  selector: "to-csv",
  templateUrl: "./to-csv.component.html",
  styleUrls: ["./to-csv.component.scss"],
})
export class ToCsvComponent implements OnInit {
  private _data: IReport[];

  get data(): IReport[] {
    return this._data;
  }

  @Input("data") set data(val: IReport[]) {
    this._data = val;
  }
  constructor() {}

  ngOnInit() {}

  downloadCSV() {
    toCSV(this.data);
  }
}
