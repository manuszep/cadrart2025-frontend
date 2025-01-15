import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  Signal,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CadrartFormControl } from '../form-control';
import { CadrartFieldTextComponent } from '../text/text.component';
import { CadrartFormErrorPipe } from '../error.pipe';
import { CadrartField, ICadrartFieldConfig } from '../field-config.model';
import { CadrartFieldNumberComponent } from '../number/number.component';
import { CadrartFieldCheckboxComponent } from '../checkbox/checkbox.component';
import { CadrartFieldImageComponent } from '../image/image.component';
import { CadrartFieldOrientationComponent } from '../orientation/orientation.component';
import { CadrartFieldSelectComponent } from '../select/select.component';
import { CadrartFieldBaseComponent } from '../field.model';
import { CadrartFieldDateComponent } from '../date/date.component';
import { CadrartFieldAddressComponent } from '../address/address.component';

@Component({
  selector: 'cadrart-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    CadrartFieldCheckboxComponent,
    CadrartFieldDateComponent,
    CadrartFieldImageComponent,
    CadrartFieldNumberComponent,
    CadrartFieldOrientationComponent,
    CadrartFieldSelectComponent,
    CadrartFieldTextComponent,
    CadrartFieldAddressComponent,
    CadrartFormErrorPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CadrartFieldComponent,
      multi: true
    }
  ]
})
export class CadrartFieldComponent<TValue, TConfig extends ICadrartFieldConfig>
  implements OnInit, ControlValueAccessor
{
  private _value!: TValue | null;

  @Input({ required: false }) config?: CadrartField<TConfig>;
  @Input({ required: true }) formControlName!: string;

  public onChange: (val: TValue | null) => unknown = () => {
    return;
  };
  public onTouched: () => unknown = () => {
    return;
  };
  public control!: CadrartFormControl<TValue, CadrartField<TConfig>>;
  public form!: FormGroup;

  public finalConfig!: Signal<CadrartField<TConfig>>;

  @ViewChild('fld') controlElement?: CadrartFieldBaseComponent<TValue, CadrartField<TConfig>>;

  @Output() public cadrartBlur: EventEmitter<void> = new EventEmitter<void>();
  @Output() public cadrartChange: EventEmitter<TValue | null> = new EventEmitter<TValue | null>();

  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    // Extract the FormControl from the parent FormGroup. This is required as it contains the field configuration.
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer?.control?.get(this.formControlName) as CadrartFormControl<
          TValue,
          CadrartField<TConfig>
        >;
        this.finalConfig = computed(() => ({ ...this.control.config, ...this.config } as CadrartField<TConfig>));
        this.form = this.controlContainer.control as FormGroup;
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn("Can't find parent FormGroup directive");
    }
  }

  get value(): TValue | null {
    return this._value;
  }

  set value(val: TValue | null) {
    this._value = val;
    this.cadrartChange.emit(val);
    this.onTouched();
  }

  focus(): void {
    this.controlElement?.focus();
  }

  registerOnChange(fn: (value: TValue | null) => void): void {
    this.onChange = fn;
  }

  writeValue(value: TValue | null): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleBlur(): void {
    this.cadrartBlur.emit();
  }

  handleChange(value: TValue | null): void {
    this.cadrartChange.emit(value);
  }
}
