import { Injectable } from "@angular/core";
import { IRoadSegment } from "src/app/shared/models";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class WatcherService {
  private readonly _target: BehaviorSubject<IRoadSegment> = new BehaviorSubject(
    null
  );
  target$ = this._target.asObservable();
  set target(val: IRoadSegment) {
    this._target.next(val);
  }

  get target(): IRoadSegment {
    return this._target.getValue();
  }
  constructor() {}
}
