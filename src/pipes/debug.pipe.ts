import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartDebug'
})
export class CadrartDebugPipe implements PipeTransform {
  transform(value?: any): void {
    console.info(value);
  }
}
