import { concatMap, of, tap } from 'rxjs';

export function isNotEmpty(value: unknown): boolean {
  return isDefined(value) && value !== '';
}

export function isDefined(value: unknown): boolean {
  return value !== undefined && value !== null;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object';
}

export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function tapFirst<T, R>(c: (value: T) => R) {
  return concatMap((v1: T, index: number) => (index === 0 ? of(v1).pipe(tap((v2: T) => c(v2))) : of(v1)));
}

export function throttle(func: () => any, wait: number, options: { leading?: boolean; trailing?: boolean } = {}) {
  let timeout: number | null;
  let context: any;
  let args: [] = [];
  let result: any;
  let previous = 0;

  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);

    if (!timeout) {
      context = args = [];
    }
  };

  const throttled = function (this: any, ...rest: []) {
    const _now = new Date().getTime();

    if (!previous && options.leading === false) {
      previous = _now;
    }

    const remaining = wait - (_now - previous);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this;
    args = rest;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = _now;
      result = func.apply(context, args);

      if (!timeout) {
        context = args = [];
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining) as any as number;
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout as number);
    previous = 0;
    timeout = null;
    context = null;
    args = [];
  };

  return throttled;
}
