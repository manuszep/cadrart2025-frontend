import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'cadrartFormula'
})
export class CadrartFormulaPipe implements PipeTransform {
  constructor(protected _sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    const parts = value.split(';');
    const formattedParts = parts.map((part) => {
      let newPart: string;

      newPart = part.replace(/([+*/-])/g, '<span class="formula__step__operator">$1</span>');
      newPart = newPart.replace('-', '&minus;');
      newPart = newPart.replace('+', '&plus;');
      newPart = newPart.replace('*', '&times;');
      newPart = newPart.replace('>/<', '>&divide;<');
      newPart = newPart.replace(':', '<span class="formula__step__delimiter"></span>');

      return `<span class="formula__step">${newPart}</span>`;
    });

    return this._sanitizer.bypassSecurityTrustHtml(`<span class="formula">${formattedParts.join('')}</span>`);
  }
}
