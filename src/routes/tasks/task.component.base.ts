import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { ECadrartArticleFamily, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartExtendedTask } from '../../models/extended-task.model';
import { CadrartTaskService } from '../../services/task.service';
import { CadrartDataConnectorService } from '../../services/data-connector.service';

@Component({
  selector: 'cadrart-route-tasks-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export abstract class CadrartRouteTasksBaseComponent {
  protected abstract family: ECadrartArticleFamily;
  public tasks!: Observable<CadrartExtendedTask[]>;
  public trackBy = (_index: number, item: CadrartExtendedTask): number | undefined => item.id;

  protected readonly service = inject(CadrartTaskService);
  protected readonly dataConnectorService = inject(CadrartDataConnectorService<ICadrartExtendedTask>);

  protected init(): void {
    this.tasks = this.dataConnectorService
      .connect({
        requestor: () => this.service.getEntitiesForFamily(this.family),
        accessors: {
          // TODO: Implement accessors
        },
        showPagination: false
      })
      .pipe(
        takeUntilDestroyed(),
        map((tasks: ICadrartExtendedTask[]) => {
          return tasks.map((task: ICadrartExtendedTask) => {
            return new CadrartExtendedTask(task);
          });
        })
      );
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
