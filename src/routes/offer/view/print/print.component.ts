import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ICadrartJob } from '@manuszep/cadrart2025-common';
import { CommonModule } from '@angular/common';

import { CadrartAmountPipe } from '../../../../pipes/amount.pipe';
import { PartialDeep } from '../../../../utils/types';
import { CadrartPricePipe } from '../../../../pipes/price.pipe';
import { CadrartExtractTasksPipe } from '../../../../pipes/extract-tasks.pipe';
import { CadrartJobMeasurePipe } from '../../../../pipes/job-measure.pipe';
import { CadrartJobOrientationPipe } from '../../../../pipes/job-orientation.pipe';
import { CadrartAddressPipe } from '../../../../pipes/cadrart-address.pipe';

@Component({
  selector: 'cadrart-route-offer-view-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartAmountPipe,
    CadrartPricePipe,
    CadrartExtractTasksPipe,
    CadrartJobMeasurePipe,
    CadrartJobOrientationPipe,
    CadrartAddressPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteOfferViewPrintComponent {
  @Input({ required: true }) offerNumber!: string | null;
  @Input({ required: true }) offerDate?: string;
  @Input({ required: true }) clientName!: string;
  @Input({ required: true }) clientAddress?: string;
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
