import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartRouteTasksBaseComponent } from '../task.component.base';

@Component({
  selector: 'cadrart-route-tasks-wood',
  templateUrl: './wood.component.html',
  styleUrls: [],
  imports: [CommonModule, CadrartTableComponent, CadrartTableValueFormatterDirective, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteTasksWoodComponent extends CadrartRouteTasksBaseComponent {
  protected family = ECadrartArticleFamily.WOOD;

  constructor() {
    super();
    this.init();
  }
}
