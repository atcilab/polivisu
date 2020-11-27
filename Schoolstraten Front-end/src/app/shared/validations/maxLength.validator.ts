import { AbstractControl } from "@angular/forms";

export function maxLength(control: AbstractControl, length: number = 1) {
  if ([...control.value].length !== length) {
    return { maxLength: true };
  } else {
    return null;
  }
}
