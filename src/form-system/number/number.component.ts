import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartIconComponent } from '../../components/icon/icon.component';
import { CadrartFieldLayoutComponent } from '../field-layout/field-layout.component';
import { CadrartFieldBaseComponent } from '../field.model';

import { CadrartFieldNumber } from './number.config';

@Component({
  selector: 'cadrart-field-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CadrartIconComponent, CadrartFieldLayoutComponent]
})
export class CadrartFieldNumberComponent extends CadrartFieldBaseComponent<number, CadrartFieldNumber> {
  public label?: string;
  public placeholder?: string;

  @Output() public cadrartBlur: EventEmitter<void> = new EventEmitter<void>();

  protected override setup(): void {
    this.label = this.config?.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
    this.placeholder = this.config?.placeholder ? `FIELD.${this.name.toUpperCase()}.PLACEHOLDER` : ``;
  }

  public handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;

    if (target.value.length > 1 && target.value[0] === '0') {
      target.value = target.value.slice(1);
    }
  }

  public handleFocus(e: FocusEvent): void {
    const target = e.target as HTMLInputElement;

    if (target.value === '0') {
      target.select();
    }
  }

  public handleBlur(): void {
    this.cadrartBlur.emit();
  }
}
