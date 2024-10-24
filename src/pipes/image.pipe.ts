import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../environments/environment';
import { ICadrartImageFolder, ICadrartImageSize } from '../components/image/image.model';

@Pipe({
  name: 'cadrartFieldImagePathPipe',
  standalone: true
})
export class CadrartFieldImagePathPipe implements PipeTransform {
  transform(value: string | null | undefined, folder?: ICadrartImageFolder, size: ICadrartImageSize = 'm'): string {
    if (!value) {
      return '';
    }

    const sizeString = size === 'o' ? '' : `_${size}`;

    return `${environment.imageUrl}uploads/${folder ?? 'default'}/${value}${sizeString}.webp`;
  }
}
