import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartExtendedTask } from '../../../models/extended-task.model';
import { CadrartRouteTasksComponent } from '../tasks.component';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';

@Component({
  selector: 'cadrart-route-tasks-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: [],
  imports: [
    CommonModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartButtonComponent,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteTasksAssemblyComponent {
  private readonly parentComponent = inject(CadrartRouteTasksComponent);
  public tasks = this.parentComponent.getTasksForCategory(ECadrartArticleFamily.ASSEMBLY);

  public trackBy = (_index: number, item: CadrartExtendedTask): number | undefined => item.id;

  getParentArticleName(tasks: CadrartExtendedTask[], id: number): string | null {
    if (!id) {
      return '';
    }
    return tasks.filter((task: CadrartExtendedTask) => {
      return task.id === id;
    })[0].articleName;
  }

  getAllTasksForJob(tasks: CadrartExtendedTask[], jobId: number): CadrartExtendedTask[] {
    return tasks.filter((task: CadrartExtendedTask) => {
      return task.jobId === jobId;
    });
  }

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
