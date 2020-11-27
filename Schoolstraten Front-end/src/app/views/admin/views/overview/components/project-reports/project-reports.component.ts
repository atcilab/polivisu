import { Component, OnInit, Input } from "@angular/core";
import { IProject } from "src/app/shared/models";

@Component({
  selector: "p-reports",
  templateUrl: "./project-reports.component.html",
  styleUrls: ["./project-reports.component.scss"],
})
export class ProjectReportsComponent implements OnInit {
  private _title: string;
  @Input("p-title") set title(val: string) {
    this._title = val;
  }
  get title(): string {
    return this._title;
  }

  private _projects: IProject[];
  @Input("p-projects") set projects(val: IProject[]) {
    this._projects = val;
  }
  get projects(): IProject[] {
    return this._projects;
  }

  private _navigate: string;
  @Input("navigate") set navigate(val: string) {
    this._navigate = val;
  }
  get navigate(): string {
    return this._navigate;
  }

  get active(): number {
    if (!this.projects) return 0;
    return this.projects.filter((p) => p.isActive).length;
  }

  get inactive(): number {
    if (!this.projects) return 0;
    return this.projects.filter((p) => !p.isActive).length;
  }

  constructor() {}

  ngOnInit() {}
}
