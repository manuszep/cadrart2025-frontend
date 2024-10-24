import { FormControl, FormControlOptions, FormControlState } from '@angular/forms';

import { CadrartField, ICadrartFieldConfig } from './field-config.model';

export class CadrartFormControl<
  TValue,
  TConfig extends CadrartField<ICadrartFieldConfig> | FormControlOptions = CadrartField<ICadrartFieldConfig>
> extends FormControl<TValue | null> {
  public config: TConfig;

  constructor(value: TValue = null as unknown as TValue, config?: TConfig) {
    const disabled = (config as CadrartField<ICadrartFieldConfig>)?.disabled ?? false;
    const nonNullable = (config as CadrartField<ICadrartFieldConfig>)?.nonNullable ?? false;
    const updateOn = (config as CadrartField<ICadrartFieldConfig>)?.updateOn ?? 'change';
    const validation = (config as CadrartField<ICadrartFieldConfig>)?.validation ?? [];
    const asyncValidation = (config as CadrartField<ICadrartFieldConfig>)?.asyncValidation ?? [];

    super(
      {
        value: value,
        disabled: disabled
      } as FormControlState<TValue>,
      {
        nonNullable: nonNullable,
        updateOn: updateOn,
        validators: validation,
        asyncValidators: asyncValidation
      }
    );

    this.config = config ?? ({} as unknown as TConfig);
  }
}
