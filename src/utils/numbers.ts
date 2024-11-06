export function isNumber(value: unknown): boolean {
  return typeof value === 'number' && !isNaN(value) && value !== null;
}

export function numberTo2Decimal(value: number): string {
  return Number(value).toFixed(2);
}

export function numberRound2(num: number): number {
  return Math.round(num * 100) / 100;
}

export function addVat(price: number | undefined, vat = 21): number {
  return numberRound2((price || 0) * (1 + vat / 100));
}

export function applyReduction(price: number, reduction: number): number {
  const priceFraction = (price / 100) * reduction;

  return numberRound2(price - priceFraction);
}
