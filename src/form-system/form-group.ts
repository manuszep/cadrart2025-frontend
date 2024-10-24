import { AbstractControl, AbstractControlOptions, FormGroup } from '@angular/forms';

import { PartialDeep } from '../utils/types';

export type FormConfig = {
  [K: string]: AbstractControl;
};

export abstract class CadrartFormGroup<TEntity> extends FormGroup {
  constructor(
    formConfig: FormConfig,
    entity: PartialDeep<TEntity>,
    options: AbstractControlOptions = { updateOn: 'change' }
  ) {
    super(formConfig, options);

    if (entity) {
      this.patchValue(entity);
    }
  }

  public override getRawValue(): PartialDeep<TEntity> {
    const value = super.getRawValue();

    return {
      ...value,
      id: value.id === null ? undefined : value.id
    };
  }
}
