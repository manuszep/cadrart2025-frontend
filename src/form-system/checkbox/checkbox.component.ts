import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartIconComponent } from '../../components/icon/icon.component';
import { CadrartFieldBaseComponent } from '../field.model';

import { CadrartFieldCheckbox } from './checkbox.config';

@Component({
  selector: 'cadrart-field-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, CadrartIconComponent]
})
export class CadrartFieldCheckboxComponent extends CadrartFieldBaseComponent<boolean, CadrartFieldCheckbox> {
  public label?: string;

  protected override setup(): void {
    this.label = this.config?.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
  }
}
