import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, combineLatest, map } from 'rxjs';

import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartButtonComponent } from '../button/button.component';

@Component({
  selector: 'cadrart-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartPaginationComponent implements OnDestroy {
  private unsubscribeSubject$ = new Subject<void>();

  public templateData;

  constructor(private dataConnectorService: CadrartDataConnectorService) {
    this.templateData = combineLatest([
      this.dataConnectorService.total,
      this.dataConnectorService.pageSize,
      this.dataConnectorService.page
    ]).pipe(
      map(([total, pageSize, page]) => ({
        total,
        pageSize,
        page,
        lastPage: Math.ceil(total / pageSize),
        looper: Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1)
      }))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next(void 0);
    this.unsubscribeSubject$.complete();
  }

  handlePageClick(page: number): void {
    this.dataConnectorService.setPage(page);
  }

  handlePageSizeClick(pageSize: number): void {
    this.dataConnectorService.setPageSize(pageSize);
  }

  handleFirstClick(): void {
    this.dataConnectorService.setPage(1);
  }

  handleLastClick(): void {
    this.dataConnectorService.setPage('last');
  }

  handlePreviousClick(): void {
    this.dataConnectorService.setPage('previous');
  }

  handleNextClick(): void {
    this.dataConnectorService.setPage('next');
  }
}
