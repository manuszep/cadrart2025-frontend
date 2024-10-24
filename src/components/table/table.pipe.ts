import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cadrartTableGetEntryNamePipe',
  standalone: true
})
export class CadrartTableGetEntryNamePipe implements PipeTransform {
  transform(entry: { getName: () => string }): string {
    return entry.getName();
  }
}
