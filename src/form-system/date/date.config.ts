import { AbstractControl, ValidationErrors } from '@angular/forms';

import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';
import { ICadrartIcon } from '../../components/icon/icon.model';
import { htmlDateToDate } from '../../utils';
import { cadrartValidateDateFuture } from '../validators';

export interface ICadrartFieldDateConfig extends ICadrartFieldConfig {
  label?: boolean;
  placeholder?: boolean;
  iconBefore?: ICadrartIcon;
  iconAfter?: ICadrartIcon;
  textAfter?: string;
  min?: Date;
  max?: Date;
  future?: boolean;
}

export class CadrartFieldDate extends CadrartField<ICadrartFieldDateConfig> {
  public label?: boolean;
  public placeholder?: boolean;
  public iconBefore?: ICadrartIcon;
  public iconAfter?: ICadrartIcon;
  public textAfter?: string;
  public future?: boolean;
  public min?: string;
  public max?: string;
  public override componentType: ICadrartFieldComponentType = 'date';

  constructor(protected override _config: ICadrartFieldDateConfig) {
    super(_config);

    const min = _config.min
      ? _config.min.toISOString().split('T')[0]
      : _config.future
      ? new Date().toISOString().split('T')[0]
      : undefined;

    this.label = _config.label ?? true;
    this.placeholder = _config.placeholder ?? true;
    this.iconBefore = _config.iconBefore;
    this.iconAfter = _config.iconAfter;
    this.textAfter = _config.textAfter;
    this.future = _config.future ?? false;
    this.min = min;
    this.max = _config.max?.toISOString().split('T')[0];
  }

  protected override extractValidatorsFromConfig(): void {
    super.extractValidatorsFromConfig();

    this.validation = this.validation ?? [];
    this.asyncValidation = this.asyncValidation ?? [];

    if (this._config.min) {
      this.validation.push((control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const valueAsDate = value ? htmlDateToDate(value) : null;

        if (valueAsDate && this._config.min && valueAsDate < this._config.min) {
          return { minDate: true };
        }

        return null;
      });
    }

    if (this._config.max) {
      this.validation.push((control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const valueAsDate = value ? htmlDateToDate(value) : null;

        if (valueAsDate && this._config.max && valueAsDate > this._config.max) {
          return { maxDate: true };
        }

        return null;
      });
    }

    if (this._config.future) {
      this.validation.push(cadrartValidateDateFuture());
    }
  }
}
