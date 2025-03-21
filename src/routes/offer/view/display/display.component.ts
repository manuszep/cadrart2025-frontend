import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ICadrartJob } from '@manuszep/cadrart2025-common';

import { CadrartAmountPipe } from '../../../../pipes/amount.pipe';
import { PartialDeep } from '../../../../utils/types';
import { CadrartPricePipe } from '../../../../pipes/price.pipe';
import { CadrartJobMeasurePipe } from '../../../../pipes/job-measure.pipe';
import { CadrartCardComponent } from '../../../../components/card/card.component';

@Component({
  selector: 'cadrart-route-offer-view-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  imports: [TranslateModule, CadrartAmountPipe, CadrartPricePipe, CadrartJobMeasurePipe, CadrartCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteOfferViewDisplayComponent {
  @Input({ required: true }) offerNumber!: string | null;
  @Input({ required: true }) clientName!: string;
  @Input({ required: true }) assignedToName!: string;
  @Input({ required: true }) vat!: number;
  @Input({ required: true }) reduction!: number;
  @Input({ required: true }) jobs!: PartialDeep<ICadrartJob[]> | null;
  @Input({ required: true }) total!: number;
  @Input({ required: true }) totalWithVat!: number;

  @Output() jobImageClick: EventEmitter<string> = new EventEmitter<string>();

  handleJobImageClick(e: string): void {
    this.jobImageClick.emit(e);
  }
}
