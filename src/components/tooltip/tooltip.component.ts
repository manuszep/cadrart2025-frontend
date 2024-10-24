import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { CadrartActionsGroupComponent } from '../actions-group/actions-group.component';
import { CadrartStringOrTemplateComponent } from '../string-or-template/string-or-template.component';
import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';

import { CadrartTooltipService } from './tooltip.service';

@Component({
  selector: 'cadrart-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [CommonModule, CadrartActionsGroupComponent, CadrartStringOrTemplateComponent, CadrartClickOutsideDirective],
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
