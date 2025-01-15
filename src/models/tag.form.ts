import { AbstractControlOptions } from '@angular/forms';
import { ICadrartTag } from '@manuszep/cadrart2025-common';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { CadrartFieldText } from '../form-system/text/text.config';

function getTagFormConfig(): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    name: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 }))
  };
}

export class CadrartTagForm extends CadrartFormGroup<ICadrartTag> {
  constructor(entity?: ICadrartTag, options: AbstractControlOptions = { updateOn: 'change' }) {
    super(getTagFormConfig(), entity ?? {}, options);
  }
}
