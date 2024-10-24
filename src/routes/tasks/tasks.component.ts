import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ICadrartEntitiesResponse, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartExtendedTask } from '../../models/extended-task.model';
import { CadrartTableComponent } from '../../components/table/table.component';
import { CadrartTaskService } from '../../services/task.service';
import { CadrartTableValueFormatterDirective } from '../../components/table/table-value-formatter.directive';
import { CadrartButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'cadrart-route-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  imports: [CommonModule, CadrartTableComponent, CadrartTableValueFormatterDirective, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteTasksComponent implements OnDestroy {
  public tasks?: Observable<CadrartExtendedTask[]>;
  public trackBy = (index: number, item: CadrartExtendedTask) => item.id;

  private unsubscribeSubject$ = new Subject<void>();

  constructor(
    private readonly service: CadrartTaskService,
    private readonly dataConnectorService: CadrartDataConnectorService
  ) {
    this.connect(this.filterConnection.bind(this));
  }

  ngOnDestroy() {
    this.unsubscribeSubject$.next(void 0);
    this.unsubscribeSubject$.complete();
  }

  filterConnection(page: number, count: number): Observable<ICadrartEntitiesResponse<ICadrartExtendedTask>> {
    return this.service.getEntities(page, count);
  }

  connect(method: (page: number, count: number) => Observable<ICadrartEntitiesResponse<ICadrartExtendedTask>>): void {
    this.tasks = this.dataConnectorService
      .connect({
        requestor: method,
        accessors: {
          // TODO: Implement accessors
        }
      })
      .pipe(
        takeUntil(this.unsubscribeSubject$),
        map((tasks: ICadrartExtendedTask[]) =>
          tasks.map((entry: ICadrartExtendedTask) => new CadrartExtendedTask(entry))
        )
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
