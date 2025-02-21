import { ValidatorFn } from '@angular/forms';
import { ECadrartJobOrientation } from '@manuszep/cadrart2025-common';
import { EsfsFormControl, IEsfsSignalConfigToSimpleConfig } from '@manuszep/es-form-system';

export type ICadrartFormControlOrientationConfig = Partial<
  IEsfsSignalConfigToSimpleConfig<CadrartFormControlOrientationBase>
>;

export class CadrartFormControlOrientationBase extends EsfsFormControl<ECadrartJobOrientation> {
  constructor(value: ECadrartJobOrientation, config?: ICadrartFormControlOrientationConfig) {
    super(value ?? ECadrartJobOrientation.VERTICAL, config ?? {});

    this.setupValidators();
    this.updateConfig(config);
  }

  protected override buildValidatorsArray(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.buildValidatorsArray();

    /**
     * Signals can change and if we setup the validators according to the current config, it may not be valid later on
     *
     * So we set a validator for all cases anyways and inside it, we access the values of the signals.
     * So the values of the signals are checked every time a validator runs.
     */
    return validators;
  }
}
