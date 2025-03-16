import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartConcatPipe'
})
export class CadrartConcatPipe implements PipeTransform {
  transform(strings: (string | number | symbol)[]): string {
    return strings.concat().join('');
  }
}
