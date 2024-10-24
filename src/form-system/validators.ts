import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cadrartValidateDateFuture(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (value && value < today) {
      return { futureDate: true };
    }

    return null;
  };
}
