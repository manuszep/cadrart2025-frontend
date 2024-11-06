import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  signal
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartFieldLayoutComponent } from '../field-layout/field-layout.component';
import { CadrartFieldBaseComponent } from '../field.model';
import {
  CadrartControlValueTransformerDirective,
  ICadrartControlValueTransformer
} from '../control-value-transformer.directive';
import { dateToHtmlDate, htmlDateToDate } from '../../utils';

import { CadrartFieldDate } from './date.config';

@Component({
  selector: 'cadrart-field-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CadrartFieldLayoutComponent,
    CadrartControlValueTransformerDirective
  ]
})
export class CadrartFieldDateComponent extends CadrartFieldBaseComponent<boolean, CadrartFieldDate> {
  public label?: string;
  public placeholder?: string;
  public hasValue: WritableSignal<boolean> = signal(this.getHasValue());

  public transformer: ICadrartControlValueTransformer<string, Date | null> = {
    toField: dateToHtmlDate,
    toControl: htmlDateToDate
  };

  @ViewChild('inputField') inputField: ElementRef<HTMLInputElement> | undefined;

  protected override setup(): void {
    if (!this.config) {
      return;
    }

    this.label = this.config.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
    this.placeholder = this.config.placeholder ? `FIELD.${this.name.toUpperCase()}.PLACEHOLDER` : ``;

    this.control.valueChanges.subscribe(() => {
      this.hasValue.set(this.getHasValue());
    });

    this.hasValue.set(this.getHasValue());
  }

  private getHasValue(): boolean {
    return !!this.control?.value;
  }
}
