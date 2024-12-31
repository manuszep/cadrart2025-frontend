import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CadrartFieldBaseComponent } from '../field.model';

import { CadrartFieldAddress, ICadrartFieldAddressValue } from './address.config';

@Component({
  selector: 'cadrart-field-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class CadrartFieldCheckboxComponent extends CadrartFieldBaseComponent<
  ICadrartFieldAddressValue,
  CadrartFieldAddress
> {
  public label?: string;

  protected override setup(): void {
    this.label = this.config?.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
  }
}
