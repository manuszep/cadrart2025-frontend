import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { CadrartStringOrTemplateComponent } from '../string-or-template/string-or-template.component';
import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';

import { CadrartTooltipService } from './tooltip.service';

@Component({
  selector: 'cadrart-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [CadrartStringOrTemplateComponent, CadrartClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartTooltipComponent {
  constructor(public readonly service: CadrartTooltipService) {}

  handleClickOutside(): void {
    if (this.service.isOpen()) {
      this.service.close();
    }
  }
}
