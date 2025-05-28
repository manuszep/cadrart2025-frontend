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
    // If no formula exists, simply apply the multiplier
    if (this.formula === null) {
      return price * multiplier;
    }

    const steps = this._parsedFormula;

    // Convert threshold from meters to centimeters for comparison with formula limits
    const thresholdInCm = threshold * 100;

    // Start with the base value
    let result = price * multiplier;

    // Find the highest applicable threshold-based step (excluding baseline steps with start=0)
    const thresholdStep = steps
      .filter((step) => step.start > 0 && step.start <= thresholdInCm)
      .sort((a, b) => b.start - a.start)[0];

    if (thresholdStep) {
      // Apply the threshold-based step to the result
      result = this.applyOperation(result, thresholdStep.operation, thresholdStep.amount);
    }

    // Always apply the baseline step (start=0) if it exists
    const baselineStep = steps.find((step) => step.start === 0);
    if (baselineStep) {
      // Apply the baseline step to the result
      result = this.applyOperation(result, baselineStep.operation, baselineStep.amount);
    }

    return result;
  }

  /**
   * Helper method to apply mathematical operations
   */
  private applyOperation(value: number, operation: '+' | '-' | '*' | '/', amount: number): number {
    switch (operation) {
      case '+':
        return value + amount;
      case '-':
        return value - amount;
      case '*':
        return value * amount;
      case '/':
        return value / amount;
      default:
        return value;
    }
  }

  public static stringifyFormula(formula: ICadrartParsedFormula): string {
    const steps: string[] = [];

    for (const step of formula) {
      steps.push(`${step.start}:${step.operation}${step.amount}`);
    }

    return steps.join(';');
  }
}
