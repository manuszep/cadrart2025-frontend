import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartPhone',
  standalone: true
})
export class CadrartPhonePipe implements PipeTransform {
  transform(phone?: string): string {
    if (!phone) {
      return '';
    }

    return `<a href="tel:${phone}">${phone}</a>`;
  }
}