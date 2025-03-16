import { Pipe, PipeTransform } from '@angular/core';

export function cadrartGetAmountAsHtml(value: number, unit = '', forceDecimal = true, vat = 0): string {
  const vatValue = Number(value) * ((100 + Number(vat)) / 100);
  const valueAsString = vatValue.toFixed(2);
  const valueParts = valueAsString.split('.');
  const unitHtml = unit ? `<span class="cadrart-amount__unit">&nbsp;${unit}</span>` : '';
  const decimalsHtml =
    forceDecimal || valueParts[1] !== '00' ? `.<span class="cadrart-amount__decimals">${valueParts[1]}</span>` : '';

  return `<span class="cadrart-amount__units">${valueParts[0]}</span>${decimalsHtml}${unitHtml}`;
}

@Pipe({
  name: 'cadrartAmount'
})
export class CadrartAmountPipe implements PipeTransform {
  transform(value?: number, unit = '', forceDecimal = true, vat = 0): string {
    if (typeof value === 'undefined') {
      return '<span class="cadrart-amount">-</span>';
    }

    const valueAsHtml = cadrartGetAmountAsHtml(value, unit, forceDecimal, vat);

    return `<span class="cadrart-amount">${valueAsHtml}</span>`;
  }
}
