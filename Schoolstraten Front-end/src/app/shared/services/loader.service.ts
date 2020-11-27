import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class LoaderService {
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isLoading$: Observable<boolean> = this._isLoading.asObservable();

  set isLoading(val: boolean) {
    this._isLoading.next(val);
  }

  get isLoading(): boolean {
    return this._isLoading.getValue();
  }

  constructor() {}
}
