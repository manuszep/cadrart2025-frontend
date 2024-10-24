import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartFieldLayoutComponent } from '../field-layout/field-layout.component';
import { CadrartIconComponent } from '../../components/icon/icon.component';
import { CadrartFieldBaseComponent } from '../field.model';

import { CadrartFieldSelect } from './select.config';

@Component({
  selector: 'cadrart-field-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CadrartFieldLayoutComponent,
    CadrartIconComponent
  ]
})
export class CadrartFieldSelectComponent<TValue = any> extends CadrartFieldBaseComponent<TValue, CadrartFieldSelect> {
  label?: string;
  placeholder?: string;

  @Output() public cadrartBlur: EventEmitter<void> = new EventEmitter<void>();

  protected override setup(): void {
    this.label = this.config?.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
    this.placeholder = this.config?.placeholder ? `FIELD.${this.name.toUpperCase()}.PLACEHOLDER` : ``;
  }

  public compareFn(option: any, value: any): boolean {
    if (value === null || typeof value === 'undefined' || typeof option === 'undefined') {
      return false;
    }

    if (value.id && option.id) {
      return value.id === option.id;
    }

    const val = value.getRaw ? JSON.stringify(value.getRaw()) : JSON.stringify(value);
    const optionVal = option.getRaw ? JSON.stringify(option.getRaw()) : JSON.stringify(option);

    return optionVal === val;
  }

  handleBlur(): void {
    this.cadrartBlur.emit();
  }

  handleChange(): void {
    this.cadrartChange.emit(this.control.value);
  }
}
