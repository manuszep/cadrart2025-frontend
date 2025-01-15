import { AbstractControlOptions, FormArray, FormGroup } from '@angular/forms';
import { ICadrartFormula } from '@manuszep/cadrart2025-common';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldText } from '../form-system/text/text.config';
import { CadrartFieldNumber } from '../form-system/number/number.config';
import { CadrartFieldSelect } from '../form-system/select/select.config';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { PartialDeep } from '../utils/types';

import { CadrartFormula, ICadrartParsedFormula, ICadrartParsedFormulaStep } from './formula.model';

function getFormulaParsedFormConfig(): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    start: new CadrartFormControl('', new CadrartFieldNumber({ required: true, min: 0, max: 999, textAfter: 'm' })),
    operation: new CadrartFormControl(
      '*',
      new CadrartFieldSelect({
        required: true,
        placeholder: false,
        label: false,
        options: [
          { value: '+', label: '+' },
          { value: '-', label: '-' },
          { value: '*', label: '*' },
          { value: '/', label: '/' }
        ]
      })
    ),
    amount: new CadrartFormControl('', new CadrartFieldNumber({ required: true, min: 0, max: 99999 }))
  };
}

export class CadrartParsedFormulaForm extends CadrartFormGroup<ICadrartParsedFormulaStep> {
  constructor(entity?: ICadrartParsedFormulaStep, options: AbstractControlOptions = { updateOn: 'change' }) {
    super(getFormulaParsedFormConfig(), entity ?? {}, options);
  }
}

function getFormulaFormConfig(): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    name: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 50 })),
    formula: new FormArray<CadrartParsedFormulaForm>([])
  };
}

export type ICadrartFormulaParsedForm = FormGroup<ReturnType<typeof getFormulaParsedFormConfig>>;

export class CadrartFormulaForm extends CadrartFormGroup<
  ICadrartFormula | (ICadrartFormula & { formula: ICadrartParsedFormula })
> {
  constructor(entity?: ICadrartFormula, options: AbstractControlOptions = { updateOn: 'change' }) {
    super(getFormulaFormConfig(), { id: entity?.id, name: entity?.name }, options);

    this.parseFormula(entity?.formula ?? '');
  }

  public getName(): CadrartFormControl<string> {
    return this.get('name') as CadrartFormControl<string>;
  }

  public getFormula(): FormArray<CadrartParsedFormulaForm> {
    return this.get('formula') as FormArray<CadrartParsedFormulaForm>;
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
