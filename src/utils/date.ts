export function htmlDateToDate(htmlDate: string): Date | null {
  const [year, month, day] = htmlDate.split('-').map(Number);

  if (year < 1900) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function dateToHtmlDate(date: Date | null): string {
  if (!date) {
    return '';
  }

  return date.toISOString().split('T')[0];
}
