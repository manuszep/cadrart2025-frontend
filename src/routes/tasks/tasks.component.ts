import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CadrartExtendedTask } from '../../models/extended-task.model';
import { CadrartHeaderService } from '../../components/header/header.service';

@Component({
  selector: 'cadrart-route-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteTasksComponent implements OnDestroy {
  public trackBy = (_index: number, item: CadrartExtendedTask): number => item.id ?? 0;

  private readonly headerService = inject(CadrartHeaderService);

  constructor() {
    this.headerService.setNavigation([
      { label: 'Wood', path: '/tasks/wood' },
      { label: 'Cardboard', path: '/tasks/cardboard' },
      { label: 'Glass', path: '/tasks/glass' },
      { label: 'Assembly', path: '/tasks/assembly' },
      { label: 'Pass', path: '/tasks/pass' }
    ]);

    this.headerService.clearAction();
  }

  ngOnDestroy(): void {
    this.headerService.clearNavigation();
    this.headerService.clearAction();
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
