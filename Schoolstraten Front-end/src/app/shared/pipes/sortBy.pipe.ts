import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "sortBy" })
export class SortByPipe implements PipeTransform {
  constructor() {}

  transform(val: Array<any>, key: string, order: string = "asc") {
    if (!val) return;
    return Array.isArray(val) ? val.sort(this.compareValues(key)) : val;
  }

  compareValues(key: string, order: "asc" | "desc" = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }
}
