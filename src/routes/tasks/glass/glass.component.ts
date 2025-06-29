import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartTableExpandedContentDirective } from '../../../components/table/table-expanded-content.directive';
import { CadrartDatePipe } from '../../../pipes/date.pipe';
import { CadrartJobSizeComponent } from '../../../components/job-sizes/job-size.component';
import { CadrartImageComponent } from '../../../components/image/image.component';
import { CadrartRouteTasksBaseComponent } from '../task.component.base';
import { CadrartExtendedTask } from '../../../models/extended-task.model';
import { CadrartActionsGroupComponent } from '../../../components/actions-group/actions-group.component';

@Component({
  selector: 'cadrart-route-tasks-glass',
  templateUrl: './glass.component.html',
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
export class CadrartRouteTasksGlassComponent extends CadrartRouteTasksBaseComponent {
  protected family = ECadrartArticleFamily.GLASS;

  constructor() {
    super();
    this.init();
  }

  public getWoodArticle(entry: CadrartExtendedTask): CadrartExtendedTask | null {
    const allJobTasks = entry.jobTasks;
    if (!allJobTasks) {
      return null;
    }

    const woodTask = allJobTasks.find((task) => task.articleFamily === ECadrartArticleFamily.WOOD);
    return woodTask ? ({ articleName: woodTask.articleName } as CadrartExtendedTask) : null;
  }

  public hasExpandedContent = (entry: CadrartExtendedTask): boolean => {
    return !!entry.taskComment;
  };
}
