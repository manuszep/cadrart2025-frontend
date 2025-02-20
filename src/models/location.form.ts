import { ICadrartLocation } from '@manuszep/cadrart2025-common';
import {
  EsfsFormControl,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

function getLocationFormConfig(): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    name: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 })
  };
}

export class CadrartLocationForm extends EsfsFormGroup<ICadrartLocation> {
  constructor(entity?: ICadrartLocation, options: IEsfsFormGroupOptions = { updateOn: 'change' }) {
    super(getLocationFormConfig(), options, 'FIELD', false, entity ?? {});
  }
}
