import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, Signal, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ECadrartOfferStatus, ICadrartOffer } from '@manuszep/cadrart2025-common';
import { take } from 'rxjs';

import { CadrartAlertService } from '../../../components/alert/alert.service';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartFilteringComponent } from '../../../components/filtering/filtering';
import { ICadrartFilterConfig } from '../../../components/filtering/model';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartOffer } from '../../../models/offer.model';
import { CadrartMysqlDatePipe } from '../../../pipes/mysql-date.pipe';
import { CadrartPricePipe } from '../../../pipes/price.pipe';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartOfferService } from '../../../services/offer.service';

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
    CadrartFilteringComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteOfferListComponent {
  public statuses = ECadrartOfferStatus;
  public $offersResponse:Signal<ICadrartOffer[]>;
  public offers: Signal<CadrartOffer[]> = computed(() => this.$offersResponse().map((entry: ICadrartOffer) => new CadrartOffer(entry)));
  public trackBy = (_index: number, item: CadrartOffer): number => item.id ?? 0;
  public filtersConfig: ICadrartFilterConfig = {
    fields: [
      {
        key: 'period',
        label: 'OFFER_LIST.FILTER.PERIOD.TITLE',
        type: 'toggle',
        values: [
          { label: 'OFFER_LIST.FILTER.PERIOD.ALL', value: 'all', icon: 'all_inclusive' },
          { label: 'OFFER_LIST.FILTER.PERIOD.WEEK', value: 'week', icon: 'view_week' },
          { label: 'OFFER_LIST.FILTER.PERIOD.TODAY', value: 'today', icon: 'today' }
        ]
      },
      {
        key: 'status',
        label: 'OFFER_LIST.FILTER.STATUS.TITLE',
        type: 'toggle',
        values: [
          { label: 'OFFER_LIST.FILTER.STATUS.ALL', value: 'all', icon: 'all_inclusive' },
          { label: 'OFFER_LIST.FILTER.STATUS.PAUSED', value: ECadrartOfferStatus.STATUS_CREATED, icon: 'view_week' },
          { label: 'OFFER_LIST.FILTER.STATUS.ACTIVE', value: ECadrartOfferStatus.STATUS_STARTED, icon: 'today' },
          { label: 'OFFER_LIST.FILTER.STATUS.DONE', value: ECadrartOfferStatus.STATUS_DONE, icon: 'today' }
        ]
      }
    ]
  };

  public readonly service = inject(CadrartOfferService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly dataConnectorService: CadrartDataConnectorService<ICadrartOffer> = inject(CadrartDataConnectorService<ICadrartOffer>);
  private readonly router = inject(Router);
  private readonly alertService = inject(CadrartAlertService);

  constructor() {
    this.$offersResponse = this.dataConnectorService.connect({
      requestor: (page: number, count: number, _needle?: string, extra?: Record<string, unknown>) => {
        const period = extra?.['period'] as 'all' | 'week' | 'today';
        const status = extra?.['status'] as ECadrartOfferStatus | 'all';

        let start: string | undefined;
        let end: string | undefined;

        if (period === 'week') {
          const today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
          const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          start = `${sevenDaysAgo.getFullYear()}-${sevenDaysAgo.getMonth() + 1}-${sevenDaysAgo.getDate()}`;
        }

        if (period === 'today') {
          const today = new Date();
          start = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        }

        return this.service.getEntities(
          page,
          count,
          start,
          end,
          status === 'all' ? undefined : status
        );
      },
      accessors: {}
    });
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
}
