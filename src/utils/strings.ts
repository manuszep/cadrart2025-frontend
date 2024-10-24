export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isStringAndNotEmpty(value: unknown): boolean {
  return isString(value) && value.length > 0;
}
