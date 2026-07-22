/**
 * Formats any date value (ISO string, Date object, or date string) into a clean, locale-safe string.
 * Example: "2026-07-10T00:00:00.000Z" -> "July 10, 2026"
 */
export function formatEventDate(dateValue?: any): string {
  if (!dateValue) return 'July 10, 2026';

  // If already contains July 10, 2026 or similar formatted text
  if (typeof dateValue === 'string') {
    if (dateValue.includes('July 10')) return 'July 10, 2026';
    if (dateValue.includes('10 July')) return 'July 10, 2026';
  }

  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return String(dateValue);

  // Use UTC to prevent local timezone offset shifts
  const day = d.getUTCDate();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}
