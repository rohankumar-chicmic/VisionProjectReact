/**
 * Ensures a date string is treated as UTC if it lacks timezone information.
 * This handles "naive" UTC strings like "2026-04-15T11:30:00" coming from backends.
 */
const ensureUtc = (dateString: string): string => {
  if (!dateString) return dateString;
  // If it's an ISO string (contains T) but lacks 'Z' or a +/- offset
  if (
    dateString.includes('T') &&
    !dateString.endsWith('Z') &&
    !/[+-]\d{2}(:?\d{2})?$/.test(dateString)
  ) {
    return `${dateString}Z`;
  }
  return dateString;
};

/**
 * Formats a date string into a localized long format including time.
 * Example: "April 15, 2026 at 11:30 AM"
 */
export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    const normalized = ensureUtc(dateString);
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return dateString || 'N/A';

    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString || 'N/A';
  }
};

/**
 * Formats a date string into a localized short format including time.
 * Example: "Apr 15, 2026, 11:30 AM"
 */
export const formatDateTimeShort = (dateString?: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    const normalized = ensureUtc(dateString);
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return dateString || 'N/A';

    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString || 'N/A';
  }
};
