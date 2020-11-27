import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "split" })
export class SplitPipe implements PipeTransform {
  constructor() {}

  /**
   *
   * @param val String to split
   * @param separator Separate by
   * @param index The string in the array
   */
  transform(val: string, separator: string, index?: number) {
    if (!separator) return val;
    if (!val) return;
    const array = val.split(separator);
    const item = index ? array[index] : array[array.length - 1];
    return item;
  }
}
