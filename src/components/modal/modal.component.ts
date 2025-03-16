import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';
import { CadrartStringOrTemplateComponent } from '../string-or-template/string-or-template.component';

import { CadrartModalService } from './modal.service';

@Component({
  selector: 'cadrart-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartButtonComponent, CadrartStringOrTemplateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartModalComponent {
  constructor(public readonly service: CadrartModalService) {}

  handleSecondaryClick(): void {
    this.service.emitSecondaryAction();
    this.service.closeModal();
  }

  handleSubmitClick(): void {
    this.service.emitAction();
    this.service.closeModal();
  }

  handleCloseClick(): void {
    this.service.closeModal();
    this.service.emitClose();
  }
}
