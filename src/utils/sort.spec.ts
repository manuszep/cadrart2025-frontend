import { sortStringOrNumbers } from './sort';

describe('Sort Utils', () => {
  describe('sortStringOrNumbers', () => {
    it('should sort numbers correctly', () => {
      expect(sortStringOrNumbers(1, 2)).toBe(-1);
      expect(sortStringOrNumbers(2, 1)).toBe(1);
      expect(sortStringOrNumbers(2, 2)).toBe(0);
    });

    it('should sort strings correctly', () => {
      expect(sortStringOrNumbers('a', 'b')).toBe(-1);
      expect(sortStringOrNumbers('b', 'a')).toBe(1);
      expect(sortStringOrNumbers('a', 'a')).toBe(0);
    });

    it('should sort mixed strings and numbers correctly', () => {
      expect(sortStringOrNumbers('1', 2)).toBe(-1);
      expect(sortStringOrNumbers(2, '1')).toBe(1);
      expect(sortStringOrNumbers('2', 2)).toBe(0);
    });
  });
});
