import { AbstractControlOptions, Validators } from '@angular/forms';
import { ICadrartProvider } from '@manuszep/cadrart2025-common';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldText } from '../form-system/text/text.config';
import { CadrartFormGroup } from '../form-system/form-group';

function getProviderFormConfig() {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    name: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 })),
    address: new CadrartFormControl('', new CadrartFieldText({ required: false, minLength: 2, maxLength: 255 })),
    vat: new CadrartFormControl('', new CadrartFieldText({ required: false, minLength: 2, maxLength: 25 })),
    iban: new CadrartFormControl('', new CadrartFieldText({ minLength: 2, maxLength: 34 })),
    mail: new CadrartFormControl(
      '',
      new CadrartFieldText({ required: true, minLength: 2, maxLength: 150, validation: [Validators.email] })
    )
  };
}

export class CadrartProviderForm extends CadrartFormGroup<ICadrartProvider> {
  constructor(entity?: ICadrartProvider, options: AbstractControlOptions = { updateOn: 'change' }) {
    super(getProviderFormConfig(), entity ?? {}, options);
  }
}
