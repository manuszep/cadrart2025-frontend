import { ICadrartTag } from '@manuszep/cadrart2025-common';
import {
  EsfsFormControl,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

function getTagFormConfig(): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    name: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 })
  };
}

export class CadrartTagForm extends EsfsFormGroup<ICadrartTag> {
  constructor(entity?: ICadrartTag, options: IEsfsFormGroupOptions = { updateOn: 'change' }) {
    super(getTagFormConfig(), options, 'FIELD', false, entity ?? {});
  }
}
