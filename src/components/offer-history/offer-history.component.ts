import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ICadrartJob, ICadrartOffer } from '@manuszep/cadrart2025-common';

import { CadrartButtonComponent } from '../button/button.component';
import { CadrartDatePipe } from '../../pipes/date.pipe';
import { CadrartPricePipe } from '../../pipes/price.pipe';

@Component({
  selector: 'cadrart-offer-history',
  templateUrl: './offer-history.component.html',
  styleUrls: ['./offer-history.component.scss'],
  imports: [CadrartButtonComponent, CadrartDatePipe, CadrartPricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartOfferHistoryComponent {
  @Input() offers: ICadrartOffer[] = [];

  @Output() cadrartClick: EventEmitter<ICadrartJob> = new EventEmitter();

  handleClick(job: ICadrartJob): void {
    this.cadrartClick.emit(job);
  }
}
