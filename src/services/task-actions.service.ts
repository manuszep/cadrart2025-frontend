import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ECadrartArticleFamily } from '@manuszep/cadrart2025-common';

import { CadrartExtendedTask } from '../models/extended-task.model';

export interface ITaskAction {
  icon: string;
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'danger' | 'neutral' | 'transparent';
  outline?: boolean;
  disabled?: boolean;
  tooltip?: string;
  action: (task: CadrartExtendedTask) => void;
  visible?: (task: CadrartExtendedTask) => boolean;
}

export interface ITaskActionsConfig {
  family?: ECadrartArticleFamily;
  customActions?: ITaskAction[];
  includeDefaultActions?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CadrartTaskActionsService {
  private readonly router = inject(Router);

  getTaskActions(config?: ITaskActionsConfig): ITaskAction[] {
    const defaultActions = this.getDefaultActions();
    const customActions = config?.customActions || [];

    if (config?.includeDefaultActions === false) {
      return customActions;
    }

    return [...defaultActions, ...customActions];
  }

  private getDefaultActions(): ITaskAction[] {
    return [
      {
        icon: 'block',
        color: 'secondary',
        outline: true,
        tooltip: 'TASKS.ACTIONS.BLOCK',
        action: (task: CadrartExtendedTask) => this.handleBlockTask(task),
        visible: (task: CadrartExtendedTask) => this.canBlockTask(task)
      },
      {
        icon: 'play_circle',
        color: 'info',
        outline: true,
        tooltip: 'TASKS.ACTIONS.START',
        action: (task: CadrartExtendedTask) => this.handleStartTask(task),
        visible: (task: CadrartExtendedTask) => this.canStartTask(task)
      },
      {
        icon: 'production_quantity_limits',
        color: 'danger',
        outline: true,
        tooltip: 'TASKS.ACTIONS.STOP',
        action: (task: CadrartExtendedTask) => this.handleStopTask(task),
        visible: (task: CadrartExtendedTask) => this.canStopTask(task)
      }
    ];
  }

  private canBlockTask(_task: CadrartExtendedTask): boolean {
    // TODO: Implement logic to determine if task can be blocked
    return true;
  }

  private canStartTask(task: CadrartExtendedTask): boolean {
    // TODO: Implement logic to determine if task can be started
    return (task.taskDoneCount ?? 0) < (task.jobCount ?? 0);
  }

  private canStopTask(task: CadrartExtendedTask): boolean {
    // TODO: Implement logic to determine if task can be stopped
    return (task.taskDoneCount ?? 0) > 0;
  }

  private handleBlockTask(task: CadrartExtendedTask): void {
    console.log('Block task:', task);
    // TODO: Implement block task logic
  }

  private handleStartTask(task: CadrartExtendedTask): void {
    console.log('Start task:', task);
    // TODO: Implement start task logic
  }

  private handleStopTask(task: CadrartExtendedTask): void {
    console.log('Stop task:', task);
    // TODO: Implement stop task logic
  }
}
