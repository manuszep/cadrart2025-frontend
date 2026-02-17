import { ChangeDetectionStrategy, Component, computed, inject, Signal, ViewEncapsulation } from '@angular/core';
import { ECadrartArticleFamily, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { IActionsGroupAction } from '../../components/actions-group/actions-group.model';
import { CadrartExtendedTask } from '../../models/extended-task.model';
import { CadrartArticleService } from '../../services/article.service';
import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartTaskService } from '../../services/task.service';

@Component({
  selector: 'cadrart-route-tasks-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export abstract class CadrartRouteTasksBaseComponent {
  protected abstract family: ECadrartArticleFamily;
  private _$tasksResponse: Signal<ICadrartExtendedTask[]>;
  public tasks = computed(() => this.mapTasks(this._$tasksResponse()));
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
  protected readonly articleService = inject(CadrartArticleService);
  protected readonly dataConnectorService = inject(CadrartDataConnectorService<ICadrartExtendedTask>);

  constructor() {
    this._$tasksResponse = this.dataConnectorService.connect({
      requestor: (_page, _count, _needle, _extra) => this.service.getEntitiesForFamily(this.family),
      accessors: {
        // TODO: Implement accessors
      },
      showPagination: false
    });
  }

  private mapTasks(tasks: ICadrartExtendedTask[]): CadrartExtendedTask[] {
    return tasks.map((task: ICadrartExtendedTask) => new CadrartExtendedTask(task)).sort((a, b) => {
      return (a.clientFullName ?? '').localeCompare(b.clientFullName ?? '');
    });
  }

  public getRowClass(entry: CadrartExtendedTask): string | string[] | null {
    const classes: string[] = [];
    const isDone = entry.taskDoneCount === entry.jobCount;
    const isOverdue = entry.jobDueDate && new Date(entry.jobDueDate) < new Date();
    const isOutOfStock = entry.articleOutOfStock;

    // Example: Add class based on task status
    if (isDone) {
      classes.push('cadrart-tasks--completed-task');
    }

    // Example: Add class based on due date
    if (!isDone && isOverdue) {
      classes.push('cadrart-tasks--overdue-task');
    }

    if (isOutOfStock) {
      classes.push('cadrart-tasks--out-of-stock');
    }

    return classes.length > 0 ? classes : null;
  }

  private handleDoneClick(task: CadrartExtendedTask): void {
    this.service.doTask(task);
  }

  private handleUndoClick(task: CadrartExtendedTask): void {
    this.service.undoTask(task);
  }

  private handleShopClick(task: CadrartExtendedTask): void {
    this.articleService.setOutOfStock(task.articleId).subscribe();
  }

  public handleCustomAction(action: (data: CadrartExtendedTask) => void, task: CadrartExtendedTask): void {
    action(task);
  }
}
