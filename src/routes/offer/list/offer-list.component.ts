import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, take } from 'rxjs';
import { ECadrartOfferStatus, ICadrartEntitiesResponse, ICadrartOffer } from '@manuszep/cadrart2025-common';
import { Router } from '@angular/router';

import { CadrartOfferService } from '../../../services/offer.service';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartPricePipe } from '../../../pipes/price.pipe';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartAlertService } from '../../../components/alert/alert.service';
import { CadrartOffer } from '../../../models/offer.model';
import { CadrartMysqlDatePipe } from '../../../pipes/mysql-date.pipe';
import { ICadrartFilterEvent, ICadrartFiltersConfig } from '../../../components/filters/filters.model';
import { CadrartFiltersComponent } from '../../../components/filters/filters.component';

@Component({
  selector: 'cadrart-route-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
  imports: [
    CommonModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartPricePipe,
    CadrartButtonComponent,
    CadrartMysqlDatePipe,
    CadrartFiltersComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteOfferListComponent {
  public statuses = ECadrartOfferStatus;
  public offers?: Observable<CadrartOffer[]>;
  public trackBy = (_index: number, item: CadrartOffer): number | undefined => item.id;
  public filtersConfig: ICadrartFiltersConfig = [
    {
      key: 'period',
      label: 'OFFER_LIST.FILTER.PERIOD.TITLE',
      type: 'toggle',
      config: [
        { label: 'OFFER_LIST.FILTER.PERIOD.ALL', value: 'all', icon: 'all_inclusive' },
        { label: 'OFFER_LIST.FILTER.PERIOD.WEEK', value: 'week', icon: 'view_week' },
        { label: 'OFFER_LIST.FILTER.PERIOD.TODAY', value: 'today', icon: 'today' }
      ],
      value: 'all'
    },
    {
      key: 'status',
      label: 'OFFER_LIST.FILTER.STATUS.TITLE',
      type: 'toggle',
      config: [
        { label: 'OFFER_LIST.FILTER.STATUS.ALL', value: 'all', icon: 'all_inclusive' },
        { label: 'OFFER_LIST.FILTER.STATUS.PAUSED', value: ECadrartOfferStatus.STATUS_CREATED, icon: 'view_week' },
        { label: 'OFFER_LIST.FILTER.STATUS.ACTIVE', value: ECadrartOfferStatus.STATUS_STARTED, icon: 'today' },
        { label: 'OFFER_LIST.FILTER.STATUS.DONE', value: ECadrartOfferStatus.STATUS_DONE, icon: 'today' }
      ],
      value: 'all'
    }
  ];

  private filters: {
    start?: string;
    end?: string;
    status?: ECadrartOfferStatus;
  } = {};

  public readonly service = inject(CadrartOfferService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly dataConnectorService = inject(CadrartDataConnectorService<ICadrartOffer>);
  private readonly router = inject(Router);
  private readonly alertService = inject(CadrartAlertService);

  constructor() {
    this.handleFilterPeriodChange('all');
    this.handleFilterStatusChange('all');

    this.connect(this.filterConnection.bind(this));
  }

  filterConnection(page: number, count: number): Observable<ICadrartEntitiesResponse<ICadrartOffer>> {
    return this.service.getEntities(page, count, this.filters.start, this.filters.end, this.filters.status);
  }

  connect(method: (page: number, count: number) => Observable<ICadrartEntitiesResponse<ICadrartOffer>>): void {
    this.offers = this.dataConnectorService
      .connect({
        requestor: method,
        accessors: {
          // TODO: Implement accessors
        }
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((offers: ICadrartOffer[]) => offers.map((entry: ICadrartOffer) => new CadrartOffer(entry)))
      );
  }

  saveEntity(entry: CadrartOffer): void {
    if (!entry.id) {
      return;
    }

    this.service
      .updateEntity(entry.id, entry.getRawValue() as ICadrartOffer)
      .pipe(take(1))
      .subscribe();
  }

  handleStartClick(entry: CadrartOffer): void {
    entry.start();
    this.saveEntity(entry);
  }

  handleStopClick(entry: CadrartOffer): void {
    entry.stop();
    this.saveEntity(entry);
  }

  handleCompleteClick(entry: CadrartOffer): void {
    entry.complete();
    this.saveEntity(entry);
  }

  handleConsultClick(e: CadrartOffer): void {
    this.router.navigate(['offer', e.id]);

    return;
  }

  handleEditClick(e: CadrartOffer): void {
    if (e.id) {
      this.router.navigate(['offer', e.id, 'edit']);
    }
  }

  handleDeleteClick(e: CadrartOffer): void {
    if (!e.id) {
      return;
    }

    this.service.deleteEntity(e.id).subscribe(() => {
      this.alertService.add({
        type: 'success',
        message: 'OFFER_LIST.ALERTS.DELETE_SUCCESS'
      });
    });
  }

  handleFilterChange(e: ICadrartFilterEvent): void {
    if (e.key === 'period') {
      this.handleFilterPeriodChange(e.value as 'all' | 'week' | 'today');
    }

    if (e.key === 'status') {
      this.handleFilterStatusChange(e.value as ECadrartOfferStatus | 'all');
    }

    // TODO: Filtering should be updated without using connect
    this.connect((page: number, count: number) =>
      this.service.getEntities(page, count, this.filters.start, this.filters.end, this.filters.status)
    );
  }

  handleFilterPeriodChange(value: 'all' | 'week' | 'today'): void {
    if (value === 'all') {
      this.filters.start = undefined;
      this.filters.end = undefined;
    }

    if (value === 'week') {
      const today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const start = `${sevenDaysAgo.getFullYear()}-${sevenDaysAgo.getMonth() + 1}-${sevenDaysAgo.getDate()}`;
      const end = undefined;

      this.filters.start = start;
      this.filters.end = end;
    }

    if (value === 'today') {
      const today = new Date();

      this.filters.start = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      this.filters.end = undefined;
    }
  }

  handleFilterStatusChange(value: ECadrartOfferStatus | 'all'): void {
    if (value === 'all') {
      this.filters.status = undefined;
    } else {
      this.filters.status = value;
    }
  }
}
