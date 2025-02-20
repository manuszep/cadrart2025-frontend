import { ICadrartFormula } from '@manuszep/cadrart2025-common';
import {
  EsfsFormArray,
  EsfsFormControl,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

import { PartialDeep } from '../utils/types';

import { CadrartFormula, ICadrartParsedFormula, ICadrartParsedFormulaStep } from './formula.model';

function getFormulaParsedFormConfig(): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    start: new EsfsFormControlNumber(null, { required: true, min: 0, max: 999, textAfter: true }),
    operation: new EsfsFormControlDropdown<'+' | '-' | '*' | '/' | undefined>('*', {
      required: true,
      placeholder: false,
      label: false,
      options: [
        { value: '+', label: '+' },
        { value: '-', label: '-' },
        { value: '*', label: '*' },
        { value: '/', label: '/' }
      ]
    }),
    amount: new EsfsFormControlNumber(null, { required: true, min: 0, max: 99999 })
  };
}

export class CadrartParsedFormulaForm extends EsfsFormGroup<ICadrartParsedFormulaStep> {
  constructor(entity?: ICadrartParsedFormulaStep, options: IEsfsFormGroupOptions = { updateOn: 'change' }) {
    super(getFormulaParsedFormConfig(), options, 'FIELD', false, entity ?? {});
  }
}

function getFormulaFormConfig(): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    name: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 50 }),
    formula: new EsfsFormArray<CadrartParsedFormulaForm>([])
  };
}

export type ICadrartFormulaParsedForm = EsfsFormGroup<ReturnType<typeof getFormulaParsedFormConfig>>;

export class CadrartFormulaForm extends EsfsFormGroup<
  ICadrartFormula | (ICadrartFormula & { formula: ICadrartParsedFormula })
> {
  constructor(entity?: ICadrartFormula, options: IEsfsFormGroupOptions = { updateOn: 'change' }) {
    super(getFormulaFormConfig(), options, 'FIELD', false, { id: entity?.id, name: entity?.name });

    this.parseFormula(entity?.formula ?? '');
  }

  public getName(): EsfsFormControlText<string> {
    return this.get('name') as EsfsFormControlText<string>;
  }

  public getFormula(): EsfsFormArray<CadrartParsedFormulaForm> {
    return this.get('formula') as EsfsFormArray<CadrartParsedFormulaForm>;
  }

  public addFormula(): void {
    this.getFormula().push(new CadrartParsedFormulaForm());
  }

  public removeFormula(index: number): void {
    this.getFormula().removeAt(index);
  }

  public parseFormula(formula?: string): void {
    if (typeof formula === 'undefined' || formula === null) {
      return;
    }

    const steps = CadrartFormula.parseFormula(formula);

    for (const step of steps) {
      this.getFormula().push(new CadrartParsedFormulaForm(step));
    }
  }

  override getRawValue(): PartialDeep<ICadrartFormula> {
    return {
      ...super.getRawValue(),
      formula: CadrartFormula.stringifyFormula(this.getFormula().value)
    };
  }
}
