import { signal, WritableSignal } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { EsfsFormControl, IEsfsSignalConfigToSimpleConfig } from '@manuszep/es-form-system';

import { ICadrartImageFolder } from '../image/image.model';

export type ICadrartFormControlImageConfig = Partial<IEsfsSignalConfigToSimpleConfig<CadrartFormControlImageBase>>;

export class CadrartFormControlImageBase extends EsfsFormControl<string | null> {
  showLabel: WritableSignal<boolean> = signal<boolean>(false);
  folder: WritableSignal<ICadrartImageFolder> = signal<ICadrartImageFolder>('default');

  constructor(value: string | null, config?: ICadrartFormControlImageConfig) {
    super(value, config ?? {});

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
