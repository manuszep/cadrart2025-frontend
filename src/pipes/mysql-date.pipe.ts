import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartMysqlDate'
})
export class CadrartMysqlDatePipe implements PipeTransform {
  transform(value: string): string {
    const d = new Date(value);

    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
}
