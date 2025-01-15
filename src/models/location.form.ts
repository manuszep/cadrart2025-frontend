import { AbstractControlOptions } from '@angular/forms';
import { ICadrartLocation } from '@manuszep/cadrart2025-common';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { CadrartFieldText } from '../form-system/text/text.config';

function getLocationFormConfig(): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    name: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 }))
  };
}

export class CadrartLocationForm extends CadrartFormGroup<ICadrartLocation> {
  constructor(entity?: ICadrartLocation, options: AbstractControlOptions = { updateOn: 'change' }) {
    super(getLocationFormConfig(), entity ?? {}, options);
  }
}
