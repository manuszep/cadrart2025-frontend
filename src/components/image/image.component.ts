import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { CadrartFieldImagePathPipe } from '../../pipes/image.pipe';

import { ICadrartImageFolder, ICadrartImageSize } from './image.model';

@Component({
  selector: 'cadrart-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CadrartFieldImagePathPipe]
})
export class CadrartImageComponent {
  @Input({ required: true }) public name!: string;
  @Input({ required: true }) public folder!: ICadrartImageFolder;
  @Input({ required: true }) public size: ICadrartImageSize = 'm';
  @Input() public alt = '';
}
