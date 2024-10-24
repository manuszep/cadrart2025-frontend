export interface ICadrartMemoizePayload {
  // The function that will determine a unique id for the provided arguments set, determined by used
  extractUniqueId: (...args: any[]) => any;
  // A flag to use WeakMap
  doUseWeakMap?: boolean;
  // If regular map is used, you can set timeout to clear its contents, optional
  clearCacheTimeout?: number;
  // For debug purposes you can pass an exta function for logging all actions
  debugReporter?: (message: string, state?: Map<any, unknown> | WeakMap<object, unknown> | unknown) => void;
}

export type ICadrartMemoizeDecorator = (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => void;

export function cadrartMemoize(args: Omit<ICadrartMemoizePayload, 'doUseWeakMap'>): ICadrartMemoizeDecorator;
export function cadrartMemoize(args: Omit<ICadrartMemoizePayload, 'clearCacheTimeout'>): ICadrartMemoizeDecorator;
export function cadrartMemoize({ extractUniqueId, clearCacheTimeout, doUseWeakMap, debugReporter }: ICadrartMemoizePayload): ICadrartMemoizeDecorator {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor): void => {
    let cacheTeardownTimer: ReturnType<typeof setTimeout>;

    let cache = initCache(doUseWeakMap);

    const startTeardownTimeout = !clearCacheTimeout
      ? null
      : () => {
          if (cacheTeardownTimer) {
            debugReporter?.('Clearing the cache timeout timer');
            clearTimeout(cacheTeardownTimer);
          }

          debugReporter?.(`Cache to be cleared in ${clearCacheTimeout}ms`);

          cacheTeardownTimer = setTimeout(() => {
            debugReporter?.('Clearing the current cache of', cache);
            cache = initCache(doUseWeakMap);
            debugReporter?.('Cache cleared: ', cache);
          }, clearCacheTimeout);
        };

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      startTeardownTimeout?.();

      const uniqueId: any = extractUniqueId(...args);

      debugReporter?.('Looking for a value with unique id of ', uniqueId);

      if (cache.has(uniqueId)) {
        const cachedResult = cache.get(uniqueId);

        debugReporter?.('Returning cached result', cachedResult);

        return cachedResult;
      }

      debugReporter?.('No cached result found');
      const result = originalMethod.apply(this, args);

      debugReporter?.('Storing a new entry in cache: ', { uniqueId, result });
      cache.set(uniqueId, result);
      debugReporter?.('Cache updated', cache);

      return result;
    };
  };
}

function initCache(doUseWeakMap?: boolean) {
  return doUseWeakMap ? new WeakMap<object, unknown>() : new Map<any, unknown>();
}
