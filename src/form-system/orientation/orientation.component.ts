import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { CadrartButtonComponent } from '../../components/button/button.component';
import { CadrartFieldBaseComponent } from '../field.model';

import { CadrartFieldOrientation } from './orientation.config';

@Component({
  selector: 'cadrart-field-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, CadrartButtonComponent]
})
export class CadrartFieldOrientationComponent extends CadrartFieldBaseComponent<number, CadrartFieldOrientation> {
  handleClick(): void {
    this.control.setValue(this.control.value === 0 ? 1 : 0);
  }
}
