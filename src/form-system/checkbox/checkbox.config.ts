import { AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';

import {
    CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig
} from '../field-config.model';

export interface ICadrartFieldCheckboxConfig extends ICadrartFieldConfig {
  label?: boolean;
}

export class CadrartFieldCheckbox extends CadrartField<ICadrartFieldCheckboxConfig> {
  public label?: boolean;
  public override componentType: ICadrartFieldComponentType = 'checkbox';

  constructor(protected override _config: ICadrartFieldCheckboxConfig) {
    super(_config);

    this.label = _config.label ?? true;
  }

  protected override extractValidatorsFromConfig(): void {
    const validation: ValidatorFn[] = [];
    const asyncValidation: AsyncValidatorFn[] = [];

    if (this._config.required) {
      validation.push(Validators.requiredTrue);
    }

    this.validation = validation;
    this.asyncValidation = asyncValidation;
  }
}
