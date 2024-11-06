import { htmlDateToDate, dateToHtmlDate } from './date';

describe('Date Utils', () => {
  describe('htmlDateToDate', () => {
    it('should convert a valid HTML date string to a Date object', () => {
      const htmlDate = '2023-10-05';
      const result = htmlDateToDate(htmlDate);
      expect(result).toEqual(new Date(2023, 9, 5)); // Note: month is 0-indexed
    });

    it('should return null for a year less than 1900', () => {
      const htmlDate = '1899-12-31';
      const result = htmlDateToDate(htmlDate);
      expect(result).toBeNull();
    });

    it('should return null for an invalid date string', () => {
      const htmlDate = 'invalid-date';
      const result = htmlDateToDate(htmlDate);
      expect(result).toBeNull();
    });
  });

  describe('dateToHtmlDate', () => {
    it('should convert a Date object to an HTML date string', () => {
      const date = new Date(2023, 9, 5); // Note: month is 0-indexed
      const result = dateToHtmlDate(date);
      expect(result).toBe('2023-10-05');
    });

    it('should return an empty string for a null date', () => {
      const result = dateToHtmlDate(null);
      expect(result).toBe('');
    });
  });
});
