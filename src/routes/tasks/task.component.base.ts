import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { ECadrartArticleFamily, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartExtendedTask } from '../../models/extended-task.model';
import { CadrartTaskService } from '../../services/task.service';
import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { IActionsGroupAction } from '../../components/actions-group/actions-group.model';

@Component({
  selector: 'cadrart-route-tasks-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export abstract class CadrartRouteTasksBaseComponent {
  protected abstract family: ECadrartArticleFamily;
  public tasks!: Observable<CadrartExtendedTask[]>;
  public trackBy = (_index: number, item: CadrartExtendedTask): number => item.id ?? 0;
  public actions: Array<IActionsGroupAction<CadrartExtendedTask>> = [
    {
      icon: 'done',
      color: 'success',
      action: (task: CadrartExtendedTask): void => {
        this.handleDoneClick(task);
      },
      outline: true,
      tooltip: 'TASKS.ACTIONS.DONE'
    },
    {
      icon: 'undo',
      color: 'warning',
      action: (task: CadrartExtendedTask): void => {
        this.handleUndoClick(task);
      },
      outline: true,
      tooltip: 'TASKS.ACTIONS.UNDO'
    },
    {
      icon: 'shop',
      color: 'danger',
      action: (task: CadrartExtendedTask): void => {
        this.handleShopClick(task);
      },
      outline: true,
      tooltip: 'TASKS.ACTIONS.ORDER'
    }
  ];

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
          return tasks
            .map((task: ICadrartExtendedTask) => {
              return new CadrartExtendedTask(task);
            })
            .sort((a, b) => {
              return (a.clientFullName ?? '').localeCompare(b.clientFullName ?? '');
            });
        })
      );
  }

  private handleDoneClick(task: CadrartExtendedTask): void {
    console.log('handleDoneClick');
    console.log(task);
    this.service.doTask(task);
  }

  private handleUndoClick(task: CadrartExtendedTask): void {
    console.log('handleUndoClick');
    console.log(task);
    this.service.undoTask(task);
  }

  private handleShopClick(task: CadrartExtendedTask): void {
    console.log('handleShopClick');
    console.log(task);
    this.service.blockTask(task);
  }

  public handleCustomAction(action: (data: CadrartExtendedTask) => void, task: CadrartExtendedTask): void {
    action(task);
  }
}
