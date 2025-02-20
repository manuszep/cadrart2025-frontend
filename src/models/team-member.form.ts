import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';
import {
  EsfsFormControl,
  EsfsFormControlAddress,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

import { CadrartFormControlImage } from '../components/form-control-image/form-control-image.component';
import { PartialDeep } from '../utils';

function getTeamMemberFormConfig(): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    firstName: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 }),
    lastName: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 }),
    address: new EsfsFormControlAddress({}),
    mail: new EsfsFormControlText('', { maxLength: 150, type: 'email', required: true }),
    phone: new EsfsFormControlText('', { maxLength: 20, type: 'tel', required: false }),
    image: new CadrartFormControlImage('', { required: false, folder: 'team-member' }),
    password: new EsfsFormControlText('', { type: 'password', autocomplete: false })
  };
}

export class CadrartTeamMemberForm extends EsfsFormGroup<ICadrartTeamMember> {
  constructor(entity?: ICadrartTeamMember, options: IEsfsFormGroupOptions = { updateOn: 'change' }) {
    super(getTeamMemberFormConfig(), options, 'FIELD', false, entity ?? {});
  }

  public override getRawValue(): PartialDeep<ICadrartTeamMember> {
    const data = super.getRawValue();

    return {
      ...data,
      address: JSON.stringify(data.address ?? {})
    };
  }
}
