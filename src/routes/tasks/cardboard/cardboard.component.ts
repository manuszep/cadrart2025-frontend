import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartRouteTasksBaseComponent } from '../task.component.base';
import { CadrartTableExpandedContentDirective } from '../../../components/table/table-expanded-content.directive';
import { CadrartDatePipe } from '../../../pipes/date.pipe';
import { CadrartJobSizeComponent } from '../../../components/job-sizes/job-size.component';
import { CadrartImageComponent } from '../../../components/image/image.component';
import { CadrartExtendedTask } from '../../../models/extended-task.model';

@Component({
  selector: 'cadrart-route-tasks-cardboard',
  templateUrl: './cardboard.component.html',
  styleUrls: [],
  imports: [
    CommonModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartTableExpandedContentDirective,
    CadrartButtonComponent,
    TranslateModule,
    CadrartDatePipe,
    CadrartJobSizeComponent,
    CadrartImageComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteTasksCardboardComponent extends CadrartRouteTasksBaseComponent {
  protected family = ECadrartArticleFamily.CARDBOARD;

  constructor() {
    super();
    this.init();
  }

  public hasExpandedContent = (entry: CadrartExtendedTask): boolean => {
    return !!entry.taskComment;
  };
}
