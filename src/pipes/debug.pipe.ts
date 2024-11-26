import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartDebug',
  standalone: true
})
export class CadrartDebugPipe implements PipeTransform {
  transform(value?: any): void {
    console.info(value);
  }
}
