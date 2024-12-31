import { Pipe, PipeTransform } from '@angular/core';
import { ECadrartJobOrientation } from '@manuszep/cadrart2025-common';

export function cadrartGetJobOrientationLabel(value?: ECadrartJobOrientation): string {
  return typeof value !== 'undefined' ? `JOB.ORIENTATION.${value}` : '';
}

@Pipe({
  name: 'cadrartJobOrientation',
  standalone: true
})
export class CadrartJobOrientationPipe implements PipeTransform {
  transform(value?: ECadrartJobOrientation): string {
    console.log(value);
    return cadrartGetJobOrientationLabel(value);
  }
}
