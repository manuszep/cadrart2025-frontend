import { ICadrartFormula } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from './api.model';

export type ICadrartParsedFormulaStep = {
  start: number;
  operation: '+' | '-' | '*' | '/';
  amount: number;
};

export type ICadrartParsedFormula = ICadrartParsedFormulaStep[];

export class CadrartFormula extends CadrartEntity<ICadrartFormula> {
  protected _parsedFormula: ICadrartParsedFormula = [];

  get name(): string | null {
    return this._data.name ?? null;
  }

  get formula(): string | null {
    return this._data.formula ?? null;
  }

  constructor(data: Partial<ICadrartFormula> = {}) {
    super(data);

    if (data && data.formula) {
      this._parsedFormula = CadrartFormula.parseFormula(data.formula);
    }
  }

  public static parseFormula(formula?: string | null): ICadrartParsedFormula {
    if (typeof formula === 'undefined' || formula === null || formula === '') {
      return [];
    }

    const steps = formula.split(';');
    const parsedFormula: ICadrartParsedFormula = [];

    for (const step of steps) {
      const parts = step.split(':');
      const limit = Number(parts[0]);
      const operation = parts[1].substring(0, 1) as '+' | '-' | '*' | '/';
      const amount = Number(parts[1].substring(1));

      parsedFormula.push({
        start: limit,
        operation: operation,
        amount: amount
      });
    }

    return parsedFormula;
  }

  apply(price: number, multiplier: number, threshold: number): number {
    if (this.formula === null) {
      return price * multiplier;
    }

    const steps = this._parsedFormula;

    let finalOperation = '';
    let activeLimit = 0;
    let activeOperation = '';

    for (const step of steps) {
      if (step.start === 0) {
        finalOperation = `${step.operation}${step.amount}`;
      }

      if (step.start <= threshold && step.start > activeLimit) {
        activeLimit = step.start;
        activeOperation = `${step.operation}${step.amount}`;
      }
    }

    finalOperation = `((${Number(price)} * ${Number(multiplier)}) ${activeOperation})${finalOperation}`;

    return new Function('return ' + finalOperation)();
  }

  public static stringifyFormula(formula: ICadrartParsedFormula): string {
    const steps: string[] = [];

    for (const step of formula) {
      steps.push(`${step.start}:${step.operation}${step.amount}`);
    }

    return steps.join(';');
  }
}
