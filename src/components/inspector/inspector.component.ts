import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { CadrartButtonComponent } from '../button/button.component';
import { CadrartStringOrTemplateComponent } from '../string-or-template/string-or-template.component';
import { CadrartClickOutsideDirective } from '../../directives/click-outside.directive';

import { CadrartInspectorService } from './inspector.service';

@Component({
  selector: 'cadrart-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartButtonComponent,
    CadrartStringOrTemplateComponent,
    CadrartClickOutsideDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartInspectorComponent {
  constructor(public readonly service: CadrartInspectorService) {}

  handleCloseClick(): void {
    this.service.closeInspector();
    this.service.emitCloseAction();
  }

  handleClickOut(): void {
    if (this.service.closeOnClickOut()) {
      this.handleCloseClick();
    }
  }

  handleSubmitClick(): void {
    this.service.emitSubmitAction();
  }
}
