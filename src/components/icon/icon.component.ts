import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { ICadrartIcon } from './icon.model';

@Component({
  selector: 'cadrart-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartIconComponent {
  @Input() public name: ICadrartIcon = 'question_mark';
}
