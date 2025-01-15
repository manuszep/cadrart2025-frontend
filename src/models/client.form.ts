import { ICadrartClient, ICadrartTag } from '@manuszep/cadrart2025-common';
import { AbstractControlOptions } from '@angular/forms';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldNumber } from '../form-system/number/number.config';
import { CadrartFieldText } from '../form-system/text/text.config';
import { CadrartFieldSelect } from '../form-system/select/select.config';
import { CadrartTagService } from '../services/tag.service';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { CadrartFieldAddress } from '../form-system/address/address.config';

function getFormConfig(tagService: CadrartTagService): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    lastName: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 })),
    firstName: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 })),
    company: new CadrartFormControl('', new CadrartFieldText({ required: false, minLength: 2, maxLength: 50 })),
    address: new CadrartFormControl('', new CadrartFieldAddress({ required: false })),
    mail: new CadrartFormControl(
      '',
      new CadrartFieldText({ required: false, minLength: 2, maxLength: 255, type: 'email' })
    ),
    phone: new CadrartFormControl(
      '',
      new CadrartFieldText({ required: false, minLength: 2, maxLength: 20, type: 'tel' })
    ),
    phone2: new CadrartFormControl(
      '',
      new CadrartFieldText({ required: false, minLength: 2, maxLength: 20, type: 'tel' })
    ),
    vat: new CadrartFormControl(21, new CadrartFieldNumber({ required: true })),
    tag: new CadrartFormControl<ICadrartTag | undefined>(
      undefined,
      new CadrartFieldSelect({ required: false, options: tagService.getEntitiesAsOptions() })
    ),
    reduction: new CadrartFormControl(
      0,
      new CadrartFieldNumber({ required: true, min: 0, max: 100, iconAfter: 'percent' })
    )
  };
}

export class CadrartClientForm extends CadrartFormGroup<ICadrartClient> {
  constructor(
    tagService: CadrartTagService,
    entity?: ICadrartClient,
    options: AbstractControlOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(tagService), entity ?? {}, options);
  }
}
