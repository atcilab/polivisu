export class Period {
  static _id: number = 0;
  private _id: number;
  private _range: Date[];

  constructor(range: Date[]) {
    this._id = Period._id++;
    this._range = range;
  }

  set id(val: number) {
    this._id = val;
  }

  get id(): number {
    return this._id;
  }

  set range(val: Date[]) {
    this._range = val;
  }

  get range(): Date[] {
    return this._range;
  }
}
