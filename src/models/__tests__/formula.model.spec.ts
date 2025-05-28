import { CadrartFormula, ICadrartParsedFormula } from '../formula.model';

describe('CadrartFormula', () => {
  // Constructor tests
  describe('constructor', () => {
    it('should initialize with empty data', () => {
      const formula = new CadrartFormula();
      expect(formula.name).toBeNull();
      expect(formula.formula).toBeNull();
    });

    it('should initialize with provided data', () => {
      const formula = new CadrartFormula({
        name: 'Test Formula',
        formula: '0:+10;100:*1.5'
      });
      expect(formula.name).toBe('Test Formula');
      expect(formula.formula).toBe('0:+10;100:*1.5');
    });
  });

  // parseFormula static method tests
  describe('parseFormula', () => {
    it('should return empty array for undefined, null, or empty formula', () => {
      expect(CadrartFormula.parseFormula(undefined)).toEqual([]);
      expect(CadrartFormula.parseFormula(null)).toEqual([]);
      expect(CadrartFormula.parseFormula('')).toEqual([]);
    });

    it('should parse a single step formula', () => {
      const result = CadrartFormula.parseFormula('0:+10');
      expect(result).toEqual([{ start: 0, operation: '+', amount: 10 }]);
    });

    it('should parse a multi-step formula', () => {
      const result = CadrartFormula.parseFormula('0:+10;100:*1.5;200:-5');
      expect(result).toEqual([
        { start: 0, operation: '+', amount: 10 },
        { start: 100, operation: '*', amount: 1.5 },
        { start: 200, operation: '-', amount: 5 }
      ]);
    });

    it('should handle all operation types', () => {
      const result = CadrartFormula.parseFormula('0:+10;100:-5;200:*2;300:/2');
      expect(result).toEqual([
        { start: 0, operation: '+', amount: 10 },
        { start: 100, operation: '-', amount: 5 },
        { start: 200, operation: '*', amount: 2 },
        { start: 300, operation: '/', amount: 2 }
      ]);
    });
  });

  // apply method tests
  describe('apply', () => {
    it('should return price * multiplier when formula is null', () => {
      const formula = new CadrartFormula();
      expect(formula.apply(100, 1.5, 2)).toBe(150);
    });

    it('should apply formula with only baseline step (start=0)', () => {
      const formula = new CadrartFormula({
        formula: '0:+10'
      });
      // Base: 100 * 1.5 = 150, then +10 = 160
      expect(formula.apply(100, 1.5, 2)).toBe(160);
    });

    it('should apply formula with threshold-based step', () => {
      const formula = new CadrartFormula({
        formula: '100:*2'
      });
      // Threshold in cm: 2m = 200cm, which is > 100cm, so *2 applies
      expect(formula.apply(100, 1.5, 2)).toBe(300);
    });

    it('should apply highest applicable threshold step', () => {
      const formula = new CadrartFormula({
        formula: '50:+20;100:+40;200:+60'
      });
      // Threshold in cm: 1.5m = 150cm, which is > 100cm but < 200cm
      // So +40 applies: 150 + 40 = 190
      expect(formula.apply(100, 1.5, 1.5)).toBe(190);
    });

    it('should apply both threshold and baseline steps', () => {
      const formula = new CadrartFormula({
        formula: '0:+10;100:*2'
      });
      // Threshold step: 150 * 2 = 300, then baseline: 300 + 10 = 310
      expect(formula.apply(100, 1.5, 2)).toBe(310);
    });

    it('should not apply any step if threshold is below all steps', () => {
      const formula = new CadrartFormula({
        formula: '100:+10;200:+20'
      });
      // Threshold in cm: 0.5m = 50cm, which is < 100cm
      expect(formula.apply(100, 1.5, 0.5)).toBe(150);
    });

    it('should apply operations correctly for all operation types', () => {
      const addFormula = new CadrartFormula({ formula: '0:+50' });
      const subtractFormula = new CadrartFormula({ formula: '0:-25' });
      const multiplyFormula = new CadrartFormula({ formula: '0:*2' });
      const divideFormula = new CadrartFormula({ formula: '0:/2' });

      expect(addFormula.apply(100, 1, 1)).toBe(150); // 100 + 50 = 150
      expect(subtractFormula.apply(100, 1, 1)).toBe(75); // 100 - 25 = 75
      expect(multiplyFormula.apply(100, 1, 1)).toBe(200); // 100 * 2 = 200
      expect(divideFormula.apply(100, 1, 1)).toBe(50); // 100 / 2 = 50
    });

    // New tests based on the explanation
    it('should add both threshold and baseline values when both apply', () => {
      const formula = new CadrartFormula({
        formula: '0:+10;100:+20'
      });
      // Threshold: 2m = 200cm, which is > 100cm
      // So base: 100 * 1.5 = 150, then +20 for threshold, then +10 for baseline = 180
      expect(formula.apply(100, 1.5, 2)).toBe(180);
    });

    it('should only apply baseline step when threshold is below all threshold steps', () => {
      const formula = new CadrartFormula({
        formula: '0:+10;100:+20'
      });
      // Threshold: 0.5m = 50cm, which is < 100cm
      // So base: 100 * 1.5 = 150, then only +10 for baseline = 160
      expect(formula.apply(100, 1.5, 0.5)).toBe(160);
    });

    it('should only apply threshold step when no baseline step exists', () => {
      const formula = new CadrartFormula({
        formula: '1:+10;100:+20'
      });
      // Threshold: 2m = 200cm, which is > 100cm
      // So base: 100 * 1.5 = 150, then +20 for threshold = 170
      expect(formula.apply(100, 1.5, 2)).toBe(170);
    });

    it("should apply lower threshold step when bigger one doesn't apply", () => {
      const formula = new CadrartFormula({
        formula: '1:+10;100:+20'
      });
      // Threshold: 0.5m = 50cm, which is > 1cm but < 100cm
      // So base: 100 * 1.5 = 150, then +10 for threshold = 160
      expect(formula.apply(100, 1.5, 0.5)).toBe(160);
    });

    it('should return price * multiplier when threshold is below all steps', () => {
      const formula = new CadrartFormula({
        formula: '1:+10;100:+20'
      });
      // Threshold: 0.005m = 0.5cm, which is < 1cm
      // So only base: 100 * 1.5 = 150
      expect(formula.apply(100, 1.5, 0.005)).toBe(150);
    });
  });

  // stringifyFormula static method tests
  describe('stringifyFormula', () => {
    it('should stringify an empty formula', () => {
      expect(CadrartFormula.stringifyFormula([])).toBe('');
    });

    it('should stringify a single step formula', () => {
      const formula: ICadrartParsedFormula = [{ start: 0, operation: '+', amount: 10 }];
      expect(CadrartFormula.stringifyFormula(formula)).toBe('0:+10');
    });

    it('should stringify a multi-step formula', () => {
      const formula: ICadrartParsedFormula = [
        { start: 0, operation: '+', amount: 10 },
        { start: 100, operation: '*', amount: 1.5 },
        { start: 200, operation: '-', amount: 5 }
      ];
      expect(CadrartFormula.stringifyFormula(formula)).toBe('0:+10;100:*1.5;200:-5');
    });
  });
});
