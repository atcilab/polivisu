import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberToArray"
})
export class NumberToArrayPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    return new Array(value).fill(value).map((x, i) => i);
  }
}
