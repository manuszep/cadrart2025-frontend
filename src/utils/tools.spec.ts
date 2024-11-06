import { isNotEmpty, isDefined, isBoolean, isObject, isArray, isDate, isRegExp, isSymbol } from './tools';

describe('Tools Utils', () => {
  describe('isNotEmpty', () => {
    it('should return true for defined non-empty values', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty(123)).toBe(true);
      expect(isNotEmpty([1, 2, 3])).toBe(true);
    });

    it('should return false for undefined or empty values', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined('hello')).toBe(true);
      expect(isDefined(123)).toBe(true);
      expect(isDefined([])).toBe(true);
    });

    it('should return false for undefined or null values', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-boolean values', () => {
      expect(isBoolean('true')).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for object values', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(true);
    });

    it('should return false for non-object values', () => {
      expect(isObject('object')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(null)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for array values', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-array values', () => {
      expect(isArray('array')).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray({})).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for Date values', () => {
      expect(isDate(new Date())).toBe(true);
    });

    it('should return false for non-Date values', () => {
      expect(isDate('2023-10-05')).toBe(false);
      expect(isDate(123)).toBe(false);
      expect(isDate({})).toBe(false);
    });
  });

  describe('isRegExp', () => {
    it('should return true for RegExp values', () => {
      expect(isRegExp(/abc/)).toBe(true);
      expect(isRegExp(new RegExp('abc'))).toBe(true);
    });

    it('should return false for non-RegExp values', () => {
      expect(isRegExp('abc')).toBe(false);
      expect(isRegExp(123)).toBe(false);
      expect(isRegExp({})).toBe(false);
    });
  });

  describe('isSymbol', () => {
    it('should return true for symbol values', () => {
      expect(isSymbol(Symbol('symbol'))).toBe(true);
    });

    it('should return false for non-symbol values', () => {
      expect(isSymbol('symbol')).toBe(false);
      expect(isSymbol(123)).toBe(false);
      expect(isSymbol({})).toBe(false);
    });
  });
});
