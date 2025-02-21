import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'cadrartFormError',
  standalone: true
})
export class CadrartFormErrorPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(value: ValidationErrors | null | undefined): string {
    if (!value || !Object.keys(value).length) {
      return '';
    }

    const key = Object.keys(value)[0];

    return this.translateService.instant(`ERROR.VALIDATION.${key.toUpperCase()}`, value);
  }
}
