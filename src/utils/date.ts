export function htmlDateToDate(htmlDate: string): Date | null {
  const [year, month, day] = htmlDate.split('-').map(Number);

  if (year < 1900) {
    return null;
  }

  const d = new Date(year, month - 1, day);

  if (isNaN(d.getTime())) {
    return null;
  }

  return d;
}

export function dateToHtmlDate(date: Date | null): string {
  if (!date || isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
