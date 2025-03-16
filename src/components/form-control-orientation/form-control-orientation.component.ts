import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { EsfsFieldComponentBase } from '@manuszep/es-form-system';
import { ECadrartJobOrientation } from '@manuszep/cadrart2025-common';

import { CadrartButtonComponent } from '../button/button.component';

import { CadrartFormControlOrientationBase } from './form-control-orientation.model';

export class CadrartFormControlOrientation extends CadrartFormControlOrientationBase {
  override fieldComponent = CadrartFormControlOrientationComponent;
}

@Component({
  selector: 'cadrart-form-control-orientation',
  templateUrl: './form-control-orientation.component.html',
  styleUrl: './form-control-orientation.component.scss',
  imports: [CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartFormControlOrientationComponent extends EsfsFieldComponentBase<
  ECadrartJobOrientation,
  CadrartFormControlOrientation
> {
  constructor(private readonly cdRef: ChangeDetectorRef) {
    super(cdRef);
  }

  handleClick(): void {
    this.control.setValue(
      this.control.value === ECadrartJobOrientation.VERTICAL
        ? ECadrartJobOrientation.HORIZONTAL
        : ECadrartJobOrientation.VERTICAL
    );
  }
}
