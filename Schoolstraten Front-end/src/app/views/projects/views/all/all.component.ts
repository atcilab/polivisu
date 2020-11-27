import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "src/app/shared/services/projects.service";
import { IProject } from "src/app/shared/models";
import Swal from "sweetalert2";
import { AuthService } from "src/app/shared/services/auth.service";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-all",
  templateUrl: "./all.component.html",
  styleUrls: ["./all.component.scss"],
})
export class AllComponent implements OnInit {
  projects: IProject[] = [];
  isLoading: boolean = true;
  isLoggedIn = this._authService.isLogged$;
  constructor(
    private projectsService: ProjectsService,
    private _authService: AuthService
  ) {}

  async ngOnInit() {
    await this.getProjects();
  }

  async getProjects() {
    try {
      const response: any = await this.projectsService.getProjects();
      this.projects = response.projects;
      this.isLoading = false;
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        timer: 3000,
        title: "Something went wrong",
        showConfirmButton: false,
      }).then((result) => {
        this.isLoading = false;
      });
    }
  }
}
