import { isString, isStringAndNotEmpty } from './strings';

describe('String Utils', () => {
  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('isStringAndNotEmpty', () => {
    it('should return true for non-empty string values', () => {
      expect(isStringAndNotEmpty('hello')).toBe(true);
    });

    it('should return false for empty string values', () => {
      expect(isStringAndNotEmpty('')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isStringAndNotEmpty(123)).toBe(false);
      expect(isStringAndNotEmpty(null)).toBe(false);
      expect(isStringAndNotEmpty(undefined)).toBe(false);
      expect(isStringAndNotEmpty({})).toBe(false);
      expect(isStringAndNotEmpty([])).toBe(false);
    });
  });
});
