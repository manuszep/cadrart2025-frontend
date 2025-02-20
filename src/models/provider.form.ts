import { ICadrartProvider } from '@manuszep/cadrart2025-common';
import {
  EsfsFormControl,
  EsfsFormControlAddress,
  EsfsFormControlText,
  EsfsFormGroup,
  esfsValidators,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

function getProviderFormConfig(): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    name: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 }),
    address: new EsfsFormControlAddress({ country: 'BE' }),
    vat: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 25 }),
    iban: new EsfsFormControlText('', { minLength: 2, maxLength: 34 }),
    mail: new EsfsFormControlText('', {
      required: true,
      minLength: 2,
      maxLength: 150,
      validators: [esfsValidators.email()]
    })
  };
}

export class CadrartProviderForm extends EsfsFormGroup<ICadrartProvider> {
  constructor(entity?: ICadrartProvider, options: IEsfsFormGroupOptions = { updateOn: 'change' }) {
    super(getProviderFormConfig(), options, 'FIELD', false, entity ?? {});
  }
}
