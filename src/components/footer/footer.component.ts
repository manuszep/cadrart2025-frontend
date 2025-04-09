import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { CadrartStringOrTemplateComponent } from '../string-or-template/string-or-template.component';
import { CadrartPaginationComponent } from '../pagination/pagination.component';

import { CadrartFooterService } from './footer.service';

@Component({
  selector: 'cadrart-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, CadrartStringOrTemplateComponent, CadrartPaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartFooterComponent {
  constructor(public readonly service: CadrartFooterService) {}
}
