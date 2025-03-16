import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartDate'
})
export class CadrartDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    const d = new Date(value);

    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const dayPrefix = String(day).length < 2 ? '0' : '';
    const monthPrefix = String(month).length < 2 ? '0' : '';

    return `${dayPrefix}${day}/${monthPrefix}${month}/${year}`;
  }
}
