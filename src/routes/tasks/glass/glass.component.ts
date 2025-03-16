import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartExtendedTask } from '../../../models/extended-task.model';
import { CadrartRouteTasksComponent } from '../tasks.component';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';

@Component({
  selector: 'cadrart-route-tasks-glass',
  templateUrl: './glass.component.html',
  styleUrls: [],
  imports: [CommonModule, CadrartTableComponent, CadrartTableValueFormatterDirective, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteTasksGlassComponent {
  private readonly parentComponent = inject(CadrartRouteTasksComponent);
  public tasks = this.parentComponent.getTasksForCategory(ECadrartArticleFamily.GLASS);

  public trackBy = (_index: number, item: CadrartExtendedTask): number | undefined => item.id;

  handleConsultClick(task: CadrartExtendedTask): void {
    console.log(task);
  }

  handleEditClick(task: CadrartExtendedTask): void {
    console.log(task);
  }

  handleDeleteClick(task: CadrartExtendedTask): void {
    console.log(task);
  }
}
