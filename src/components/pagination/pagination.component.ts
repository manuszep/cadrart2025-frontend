import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';
import { CadrartPaginationService } from './pagination.service';

@Component({
  selector: 'cadrart-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartPaginationComponent {
  protected service = inject(CadrartPaginationService);

  handlePageClick(page: number): void {
    this.service.setPage(page);
  }

  handlePageSizeClick(pageSize: number): void {
    this.service.setPageSize(pageSize);
  }

  handleFirstClick(): void {
    this.service.setPageToFirst();
  }

  handleLastClick(): void {
    this.service.setPageToLast();
  }

  handlePreviousClick(): void {
    if (this.service.page() <= 1) {
      return;
    }

    this.service.setPage(this.service.page() - 1);
  }

  handleNextClick(): void {
    if (this.service.page() >= this.service.lastPage()) {
      return;
    }

    this.service.setPage(this.service.page() + 1);
  }
}
