import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { ECadrartArticleFamily, ICadrartEntitiesResponse, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartExtendedTask } from '../../models/extended-task.model';
import { CadrartTaskService } from '../../services/task.service';
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
  public tasks: Observable<Record<ECadrartArticleFamily, CadrartExtendedTask[]>>;
  public trackBy = (_index: number, item: CadrartExtendedTask): number | undefined => item.id;

  private readonly service = inject(CadrartTaskService);
  private readonly dataConnectorService = inject(CadrartDataConnectorService);
  private readonly headerService = inject(CadrartHeaderService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.tasks = this.dataConnectorService
      .connect({
        requestor: (page: number, count: number) => this.service.getEntities(page, count),
        accessors: {
          // TODO: Implement accessors
        }
      })
      .pipe(
        takeUntilDestroyed(),
        map((tasks: ICadrartExtendedTask[]) => {
          const mappedTasks: Record<ECadrartArticleFamily, CadrartExtendedTask[]> = {
            [ECadrartArticleFamily.GLASS]: [],
            [ECadrartArticleFamily.WOOD]: [],
            [ECadrartArticleFamily.CARDBOARD]: [],
            [ECadrartArticleFamily.ASSEMBLY]: [],
            [ECadrartArticleFamily.PASS]: []
          };

          for (const task of tasks) {
            const family = task.articleFamily as ECadrartArticleFamily;

            if (!mappedTasks[family]) {
              mappedTasks[family] = [];
            }

            mappedTasks[family].push(new CadrartExtendedTask(task));
          }

          return mappedTasks;
        })
      );

    this.headerService.setNavigation([
      { label: 'Wood', path: '/tasks/wood' },
      { label: 'Cardboard', path: '/tasks/cardboard' },
      { label: 'Glass', path: '/tasks/glass' },
      { label: 'Assembly', path: '/tasks/assembly' },
      { label: 'Pass', path: '/tasks/pass' }
    ]);

    this.headerService.setAction({ label: 'ADD', icon: 'add', tag: 'Alt + N', hotkey: 'alt.n' });
  }

  ngOnDestroy(): void {
    this.headerService.clearNavigation();
    this.headerService.clearAction();
  }

  getTasksForCategory(category: ECadrartArticleFamily): Observable<CadrartExtendedTask[]> {
    return this.tasks.pipe(map((tasks) => tasks[category]));
  }

  filterConnection(page: number, count: number): Observable<ICadrartEntitiesResponse<ICadrartExtendedTask>> {
    return this.service.getEntities(page, count);
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

  log(data: any): void {
    console.log(data);
  }
}
