import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartActionsGroupComponent } from '../../../components/actions-group/actions-group.component';
import { CadrartImageComponent } from '../../../components/image/image.component';
import { CadrartJobSizeComponent } from '../../../components/job-sizes/job-size.component';
import { CadrartTableExpandedContentDirective } from '../../../components/table/table-expanded-content.directive';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartExtendedTask } from '../../../models/extended-task.model';
import { CadrartDatePipe } from '../../../pipes/date.pipe';
import { CadrartRouteTasksBaseComponent } from '../task.component.base';

@Component({
  selector: 'cadrart-route-tasks-cardboard',
  templateUrl: './cardboard.component.html',
  styleUrls: [],
  imports: [
    CommonModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartTableExpandedContentDirective,
    TranslateModule,
    CadrartDatePipe,
    CadrartJobSizeComponent,
    CadrartImageComponent,
    CadrartActionsGroupComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteTasksCardboardComponent extends CadrartRouteTasksBaseComponent {
  protected family = ECadrartArticleFamily.CARDBOARD;

  constructor() {
    super();
  }

  public hasExpandedContent = (entry: CadrartExtendedTask): boolean => {
    return !!entry.taskComment;
  };
}
