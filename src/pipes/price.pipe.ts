import { Pipe, PipeTransform } from '@angular/core';

import { cadrartGetAmountAsHtml } from './amount.pipe';

@Pipe({
  name: 'cadrartPrice'
})
export class CadrartPricePipe implements PipeTransform {
  transform(value: number, vat = 0): string {
    const valueAsHtml = cadrartGetAmountAsHtml(value, '€', true, vat);

    return `<span class="cadrart-amount cadrart-amount--price">${valueAsHtml}</span>`;
  }
}
