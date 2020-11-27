import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { IProject } from "../models";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class ProjectsService {
  constructor(private http: HttpClient, private _authService: AuthService) {}

  public getProjects() {
    const baseURL = `${environment.baseURL}/api/projects`;
    return this.http.get<IProject[]>(baseURL).toPromise();
  }

  public getProject(id: string) {
    const baseURL = `${environment.baseURL}/api/projects/${id}`;
    return this.http.get<{ project: IProject }>(baseURL);
  }

  public createProject(obj: IProject) {
    const baseURL = `${environment.baseURL}/api/projects`;
    return this.http.post<{ saved: IProject }>(baseURL, obj).toPromise();
  }

  public updateProject(obj: IProject) {
    const baseURL = `${environment.baseURL}/api/projects/${obj._id}`;
    return this.http
      .patch<{ message: string; updated: IProject }>(baseURL, obj)
      .toPromise();
  }

  public deleteProject(id: string) {
    const baseURL = `${environment.baseURL}/api/projects/${id}`;
    return this.http
      .delete<{ message: string; deleted: IProject }>(baseURL)
      .toPromise();
  }

  public uploadFile(val: { file: File }) {
    const baseURL = `${environment.baseURL}/api/uploads`;
    const fd = new FormData();
    fd.append("image", val.file);
    return this.http.post<{ imageURL: string }>(baseURL, fd);
  }

  public deleteImage(id: string, img: string) {
    const baseURL = `${environment.baseURL}/api/uploads`;
    return this.http.delete<{ message: string }>(baseURL, {
      params: { id, path: img },
    });
  }
}
