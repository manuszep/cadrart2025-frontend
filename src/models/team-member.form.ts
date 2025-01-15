import { AbstractControlOptions } from '@angular/forms';
import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { CadrartFieldText } from '../form-system/text/text.config';
import { CadrartFieldImage } from '../form-system/image/image.config';
import { CadrartFieldAddress } from '../form-system/address/address.config';

function getTeamMemberFormConfig(): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    firstName: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 })),
    lastName: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 })),
    address: new CadrartFormControl('', new CadrartFieldAddress({})),
    mail: new CadrartFormControl('', new CadrartFieldText({ maxLength: 150, type: 'email', required: true })),
    phone: new CadrartFormControl('', new CadrartFieldText({ maxLength: 20, type: 'tel' })),
    image: new CadrartFormControl('', new CadrartFieldImage({ required: false, folder: 'team-member' })),
    password: new CadrartFormControl('', new CadrartFieldText({ type: 'password', autocomplete: false }))
  };
}

export class CadrartTeamMemberForm extends CadrartFormGroup<ICadrartTeamMember> {
  constructor(entity?: ICadrartTeamMember, options: AbstractControlOptions = { updateOn: 'change' }) {
    super(getTeamMemberFormConfig(), entity ?? {}, options);
  }
}
