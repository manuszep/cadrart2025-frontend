import { Pipe, PipeTransform } from '@angular/core';

import { ICadrartFieldAddressValue } from '../form-system/address/address.config';

export function parseJsonValue(value: string | null): ICadrartFieldAddressValue {
  if (!value) {
    return {} as ICadrartFieldAddressValue;
  }

  try {
    const parsed = JSON.parse(value) as ICadrartFieldAddressValue;

    if (parsed && typeof parsed === 'object') {
      return parsed;
    }

    return {} as ICadrartFieldAddressValue;
  } catch (_e) {
    return {} as ICadrartFieldAddressValue;
  }
}

@Pipe({
  name: 'cadrartAddress',
  standalone: true
})
export class CadrartAddressPipe implements PipeTransform {
  transform(value: string | undefined, breaks = true): string {
    if (!value) {
      return '';
    }

    const breakString = breaks ? '<br />' : ', ';
    const data = parseJsonValue(value);

    const streetAndNumber = data.street ? `${data.street ?? ''} ${data.number ?? ''}`.trim() : '';
    const zipAndCity = `${data.zip ?? ''} ${data.city ?? ''}`.trim();
    const country = data.country ?? '';

    const part1 =
      streetAndNumber && zipAndCity ? `${streetAndNumber}${breakString}${zipAndCity}` : streetAndNumber || zipAndCity;

    const fullAddress = country ? `${part1}${breakString}${country}` : part1;

    return `<a href="maps:?q=${fullAddress.replace(/<br \/>/g, ',')}" target="_blank">
  <address>${fullAddress}</address>
</a>`;
  }
}
