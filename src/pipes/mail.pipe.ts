import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartMail',
  standalone: true
})
export class CadrartMailPipe implements PipeTransform {
  transform(mail?: string): string {
    if (!mail) {
      return '';
    }

    return `<a href="mailto:${mail}">${mail}</a>`;
  }
}