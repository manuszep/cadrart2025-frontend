import { Pipe, PipeTransform } from '@angular/core';
import { ECadrartJobMeasureType } from '@manuszep/cadrart2025-common';

export function cadrartGetJobMeasureLabel(value?: ECadrartJobMeasureType): string {
  return typeof value !== 'undefined' ? `JOB.MEASURE.${value}` : '';
}

@Pipe({
  name: 'cadrartJobMeasure',
  standalone: true
})
export class CadrartJobMeasurePipe implements PipeTransform {
  transform(value?: ECadrartJobMeasureType): string {
    return cadrartGetJobMeasureLabel(value);
  }
}
