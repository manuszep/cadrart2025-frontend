import { ICadrartClient, ICadrartTag } from '@manuszep/cadrart2025-common';
import {
  EsfsFormControl,
  EsfsFormControlAddress,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

import { CadrartTagService } from '../services/tag.service';
import { PartialDeep } from '../utils';

function getFormConfig(tagService: CadrartTagService): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    lastName: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 }),
    firstName: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 }),
    company: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 50 }),
    address: new EsfsFormControlAddress({ country: 'BE' }),
    mail: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 255, type: 'email' }),
    phone: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 20, type: 'tel' }),
    phone2: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 20, type: 'tel' }),
    vat: new EsfsFormControlNumber(21, { required: true }),
    tag: new EsfsFormControlDropdown<ICadrartTag | undefined>(undefined, {
      required: false,
      options: tagService.getEntitiesAsOptions()
    }),
    reduction: new EsfsFormControlNumber(0, { required: true, min: 0, max: 100, iconAfter: 'percent' })
  };
}

export class CadrartClientForm extends EsfsFormGroup<ICadrartClient> {
  constructor(
    tagService: CadrartTagService,
    entity?: ICadrartClient,
    options: IEsfsFormGroupOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(tagService), options, 'FIELD', false, entity ?? {});
  }

  public override getRawValue(): PartialDeep<ICadrartClient> {
    const data = super.getRawValue();

    return {
      ...data,
      address: JSON.stringify(data.address ?? {})
    };
  }
}
