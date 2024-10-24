import { isNumber } from './numbers';
import { isStringAndNotEmpty } from './strings';

export function sortNumbers(a: number, b: number): number {
  if (a === b) {
    return 0;
  }

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

export function sortStrings(a: string, b: string): number {
  const valA = a.toLowerCase();
  const valB = b.toLowerCase();

  if (valA === valB) {
    return 0;
  }

  if (valA < valB) {
    return -1;
  }

  if (valA > valB) {
    return 1;
  }

  return 0;
}

function isSortable(value: any): boolean {
  return isStringAndNotEmpty(value) || isNumber(value);
}

export function sortStringOrNumbers(a: string | number, b: string | number): number {
  const isASortable = isSortable(a);
  const isBSortable = isSortable(b);

  if (!isASortable && !isBSortable) {
    return 0;
  }

  if (!isASortable) {
    return 1;
  }

  if (!isBSortable) {
    return -1;
  }

  if (isNumber(a) && isNumber(b)) {
    return sortNumbers(Number(a), Number(b));
  }

  return sortStrings(String(a), String(b));
}
