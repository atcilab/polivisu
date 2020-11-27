import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { FeatureCollection, Feature, Geometry } from "geojson";
import { IProject, IUser, IProjectCity, IAddress } from "../models";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  public getActiveSegments(): Observable<FeatureCollection> {
    const baseURL = "https://telraam-api.net/v0/segments/active";
    return this.http.get<FeatureCollection>(baseURL);
  }

  public getSegment(val: number) {
    const baseURL = `https://telraam-api.net/v0/segments/id/${val}`;
    return this.http.get<FeatureCollection>(baseURL);
  }

  public createProject(project: Partial<IProject>) {
    const baseURL = `${environment.baseURL}/api/projects`;
    return this.http.post(baseURL, project);
  }

  public getProjects() {
    const baseURL = `${environment.baseURL}/api/projects`;
    return this.http.get<{ projects: IProject[] }>(baseURL);
  }

  public removeProject(id: string) {
    const baseURL = `${environment.baseURL}/api/projects/${id}`;
    return this.http.delete<{
      message: string;
      deleted?: IProject;
      error?: any;
    }>(baseURL);
  }

  public getUsers() {
    const baseURL = `${environment.baseURL}/api/users`;
    return this.http.get<{ users: IUser[] }>(baseURL);
  }

  public updateUser(id: string, val: Partial<IUser>) {
    const baseURL = `${environment.baseURL}/api/users/${id}`;
    return this.http.patch<{ message: string; user?: IUser; error?: any }>(
      baseURL,
      val
    );
  }

  public deleteUser(id: string) {
    const baseURL = `${environment.baseURL}/api/users/${id}`;
    return this.http.delete<{ message: string; error?: any }>(baseURL);
  }

  public getCities() {
    const baseURL = `${environment.baseURL}/api/cities`;
    return this.http.get<{ cities: IProjectCity[] }>(baseURL);
  }

  public addCity(val: IProjectCity) {
    const baseURL = `${environment.baseURL}/api/cities`;
    return this.http.post<{ message: string; city: IProjectCity }>(
      baseURL,
      val
    );
  }

  public updateCity(id: string, val: Partial<IProjectCity>) {
    const baseURL = `${environment.baseURL}/api/cities/${id}`;
    return this.http.patch<{ message: string; city: IProjectCity }>(
      baseURL,
      val
    );
  }

  public removeCity(val: string) {
    const baseURL = `${environment.baseURL}/api/cities/${val}`;
    return this.http.delete<{ message: string; error?: any }>(baseURL);
  }

  public addCityImage(val: File) {
    let fd = new FormData();
    fd.append("image", val);
    const baseURL = `${environment.baseURL}/api/uploads/city`;
    return this.http.post<{ imageURL: string }>(baseURL, fd);
  }

  public removeCityImage(val: IProjectCity) {
    const baseURL = `${environment.baseURL}/api/uploads/city`;
    let params = new HttpParams({
      fromObject: {
        id: val._id,
        image: val.cityLogo,
      },
    });
    return this.http.delete<{ message?: string; city?: IProject }>(baseURL, {
      params,
    });
  }

  public focusOnAddress(val: string) {
    const baseURL = `https://nominatim.openstreetmap.org/search?q=${val}&format=json`;
    return this.http.get<IAddress[]>(baseURL);
  }
}
