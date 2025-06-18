import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartDatePipe } from '../../../pipes/date.pipe';
import { CadrartJobSizesComponent } from '../../../components/job-sizes/job-sizes.component';
import { CadrartImageComponent } from '../../../components/image/image.component';
import { CadrartRouteTasksBaseComponent } from '../task.component.base';
import { CadrartTableExpandedContentDirective } from '../../../components/table/table-expanded-content.directive';
import { CadrartActionsGroupComponent } from '../../../components/actions-group/actions-group.component';

@Component({
  selector: 'cadrart-route-tasks-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: [],
  imports: [
    CommonModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartTableExpandedContentDirective,
    TranslateModule,
    CadrartDatePipe,
    CadrartJobSizesComponent,
    CadrartImageComponent,
    CadrartActionsGroupComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteTasksAssemblyComponent extends CadrartRouteTasksBaseComponent {
  protected family = ECadrartArticleFamily.ASSEMBLY;

  constructor() {
    super();
    this.init();
  }
}
