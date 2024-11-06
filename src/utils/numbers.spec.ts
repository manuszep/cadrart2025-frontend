import { isNumber, numberTo2Decimal, numberRound2, addVat, applyReduction } from './numbers';

describe('Number Utils', () => {
  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(123.45)).toBe(true);
    });

    it('should return false for non-number values', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('numberTo2Decimal', () => {
    it('should round numbers to 2 decimal places', () => {
      expect(numberTo2Decimal(123.456)).toBe('123.46');
      expect(numberTo2Decimal(123.4)).toBe('123.40');
      expect(numberTo2Decimal(123)).toBe('123.00');
    });
  });

  describe('numberRound2', () => {
    it('should round numbers to 2 decimal places', () => {
      expect(numberRound2(123.456)).toBe(123.46);
      expect(numberRound2(123.454)).toBe(123.45);
      expect(numberRound2(123)).toBe(123.0);
    });
  });

  describe('addVat', () => {
    it('should add VAT to the price', () => {
      expect(addVat(100)).toBe(121.0); // Default VAT is 21%
      expect(addVat(100, 10)).toBe(110.0); // Custom VAT
      expect(addVat(undefined)).toBe(0.0); // Undefined price
    });
  });

  describe('applyReduction', () => {
    it('should apply reduction to the price', () => {
      expect(applyReduction(100, 10)).toBe(90.0); // 10% reduction
      expect(applyReduction(200, 50)).toBe(100.0); // 50% reduction
      expect(applyReduction(100, 0)).toBe(100.0); // 0% reduction
    });
  });
});
