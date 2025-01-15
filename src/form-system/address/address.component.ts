import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CadrartFieldBaseComponent } from '../field.model';
import { CadrartFormControl } from '../form-control';
import { CadrartFieldText } from '../text/text.config';
import { CadrartFieldLayoutComponent } from '../field-layout/field-layout.component';
import { parseJsonValue } from '../../pipes/cadrart-address.pipe';

import { CadrartFieldAddress } from './address.config';

@Component({
  selector: 'cadrart-field-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CadrartFieldLayoutComponent]
})
export class CadrartFieldAddressComponent
  extends CadrartFieldBaseComponent<string, CadrartFieldAddress>
  implements OnDestroy
{
  private unsubscriber = new Subject<void>();

  public label?: string;

  public streetControl = new CadrartFormControl<string>(
    '',
    new CadrartFieldText({ required: false, minLength: 2, maxLength: 100 })
  );
  public numberControl = new CadrartFormControl<string>(
    '',
    new CadrartFieldText({ required: false, minLength: 1, maxLength: 10 })
  );
  public cityControl = new CadrartFormControl<string>(
    '',
    new CadrartFieldText({ required: false, minLength: 2, maxLength: 50 })
  );
  public zipControl = new CadrartFormControl<string>(
    '',
    new CadrartFieldText({ required: false, minLength: 4, maxLength: 10 })
  );
  public countryControl = new CadrartFormControl<string>(
    'Belgique',
    new CadrartFieldText({ required: false, minLength: 2, maxLength: 30 })
  );

  public subForm = new FormGroup({
    street: this.streetControl,
    number: this.numberControl,
    city: this.cityControl,
    zip: this.zipControl,
    country: this.countryControl
  });

  protected override setup(): void {
    this.label = this.config?.label ? `FIELD.${this.name.toUpperCase()}.LABEL` : ``;
    const originalValue = parseJsonValue(this.control.value);

    console.log(this.control.value, originalValue);

    this.subForm.setValue({
      street: originalValue.street ?? null,
      number: originalValue.number ?? null,
      city: originalValue.city ?? null,
      zip: originalValue.zip ?? null,
      country: originalValue.country ?? 'Belgique'
    });

    this.subForm.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe((value) => {
      this.control.setValue(
        JSON.stringify({
          street: value.street ?? undefined,
          number: value.number ?? undefined,
          city: value.city ?? undefined,
          zip: value.zip ?? undefined,
          country: value.country ?? undefined
        }),
        { emitEvent: false }
      );

      console.log(this.control.value);
    });

    this.control.valueChanges.pipe(takeUntil(this.unsubscriber)).subscribe((value) => {
      const originalValue = parseJsonValue(value);

      this.subForm.setValue(
        {
          street: originalValue.street ?? null,
          number: originalValue.number ?? null,
          city: originalValue.city ?? null,
          zip: originalValue.zip ?? null,
          country: originalValue.country ?? null
        },
        { emitEvent: false }
      );
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
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
}
