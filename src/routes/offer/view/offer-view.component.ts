import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { ICadrartOffer } from '@manuszep/cadrart2025-common';

import { CadrartPricePipe } from '../../../pipes/price.pipe';
import { CadrartAmountPipe } from '../../../pipes/amount.pipe';
import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartOffer } from '../../../models/offer.model';
import { CadrartCardComponent } from '../../../components/card/card.component';
import { CadrartJobMeasurePipe } from '../../../pipes/job-measure.pipe';
import { CadrartFooterService } from '../../../components/footer/footer.service';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartImageComponent } from '../../../components/image/image.component';
import { CadrartModalService } from '../../../components/modal/modal.service';

import { CadrartRouteOfferViewDisplayComponent } from './display/display.component';
import { CadrartRouteOfferViewPrintComponent } from './print/print.component';

@Component({
  selector: 'cadrart-route-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartPricePipe,
    CadrartButtonComponent,
    CadrartCardComponent,
    CadrartJobMeasurePipe,
    CadrartAmountPipe,
    CadrartImageComponent,
    CadrartRouteOfferViewDisplayComponent,
    CadrartRouteOfferViewPrintComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteOfferViewComponent implements AfterViewInit, OnDestroy {
  public $offer: Observable<CadrartOffer>;

  @ViewChild('footerTemplate', { static: false }) footerTemplate!: TemplateRef<unknown>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly headerService: CadrartHeaderService,
    private readonly footerService: CadrartFooterService,
    private readonly modalService: CadrartModalService
  ) {
    this.$offer = this.route.data.pipe(map((data: Data) => new CadrartOffer(data['offer'] as ICadrartOffer)));
    this.headerService.clearNavigation();
    this.headerService.clearAction();
  }

  ngAfterViewInit(): void {
    this.footerService.showFooter(this.footerTemplate);
  }

  ngOnDestroy(): void {
    this.footerService.closeFooter();
  }

  handleEditClick(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  handleJobImageClick(image: string): void {
    this.modalService.showModal({
      content: CadrartImageComponent,
      fullScreen: true,
      contentInputs: {
        name: image,
        folder: 'job',
        size: 'o'
      }
    });
  }
}
