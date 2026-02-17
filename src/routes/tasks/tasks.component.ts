import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CadrartHeaderService } from '../../components/header/header.service';
import { CadrartExtendedTask } from '../../models/extended-task.model';

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
      { label: 'TASKS.MENU.WOOD', path: '/tasks/wood' },
      { label: 'TASKS.MENU.CARDBOARD', path: '/tasks/cardboard' },
      { label: 'TASKS.MENU.GLASS', path: '/tasks/glass' },
      { label: 'TASKS.MENU.ASSEMBLY', path: '/tasks/assembly' },
      { label: 'TASKS.MENU.PASS', path: '/tasks/pass' }
    ]);

    this.headerService.clearAction();
  }

  ngOnDestroy(): void {
    this.headerService.clearNavigation();
    this.headerService.clearAction();
  }
}
