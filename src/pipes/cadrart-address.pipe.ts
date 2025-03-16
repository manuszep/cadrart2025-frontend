import { Pipe, PipeTransform } from '@angular/core';
import { IEsfsFormControlAddressValue } from '@manuszep/es-form-system';

export function parseJsonValue(value: string | null): IEsfsFormControlAddressValue {
  if (!value) {
    return {} as IEsfsFormControlAddressValue;
  }

  try {
    const parsed = JSON.parse(value) as IEsfsFormControlAddressValue;

    if (parsed && typeof parsed === 'object') {
      return parsed;
    }

    return {} as IEsfsFormControlAddressValue;
  } catch (_e) {
    return {} as IEsfsFormControlAddressValue;
  }
}

@Pipe({
  name: 'cadrartAddress'
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
