import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

export interface ICadrartControlValueTransformer<TField = unknown, TControl = unknown> {
  toControl: (sourceValue: TField) => TControl;
  toField: (targetValue: TControl) => TField;
}

@Directive({
  selector:
    '[formControlName][controlValueTransformer],[ngModel][controlValueTransformer],[formControl][controlValueTransformer]',
  standalone: true
})
export class CadrartControlValueTransformerDirective<TField = unknown, TControl = unknown> {
  @Input() controlValueTransformer!: ICadrartControlValueTransformer<TField, TControl>;
  @Input() rewriteValueOnChange = true;

  private readonly originalWriteValue;

  private readonly originalRegisterOnChange;

  constructor(private readonly ngControl: NgControl) {
    this.originalWriteValue = this.ngControl?.valueAccessor?.writeValue;
    this.originalRegisterOnChange = this.ngControl?.valueAccessor?.registerOnChange;

    if (!this.ngControl || !this.ngControl.valueAccessor) {
      throw new Error('NgControl is required');
    }

    this.ngControl.valueAccessor.registerOnChange = this.registerOnChange;
    this.ngControl.valueAccessor.writeValue = this.writeValue;
  }

  /**
   * Patches the given `onChange` method by transforming the incoming target values to
   * the source value type and than call the original `onChange` function.
   * This is the value that goes inside the form control.
   */
  registerOnChange = (onChange: (sourceValue: TControl) => void): void => {
    if (!this.originalRegisterOnChange) {
      throw new Error('NgControl is required');
    }

    this.originalRegisterOnChange.call(this.ngControl.valueAccessor, (targetValue: TField) => {
      if (this.controlValueTransformer) {
        try {
          const controlValue = this.controlValueTransformer.toControl(targetValue);

          if (this.rewriteValueOnChange && controlValue) {
            this.writeValue(controlValue);
          }

          onChange(controlValue);
        } catch (_error) {
          onChange(targetValue as unknown as TControl);
        }
      }
    });
  };

  /**
   * Transforms the provided source value to the target value type and than call the original `writeValue` implementation.
   * This is the value that goes inside the input field.
   */
  writeValue = (sourceValue: TControl): void => {
    if (this.controlValueTransformer && this.originalWriteValue) {
      try {
        const targetValue = this.controlValueTransformer.toField(sourceValue);

        this.originalWriteValue.call(this.ngControl.valueAccessor, targetValue);
      } catch (_error) {
        this.originalWriteValue.call(this.ngControl.valueAccessor, sourceValue);
      }
    }
  };
}
