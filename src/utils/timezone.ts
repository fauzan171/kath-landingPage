/**
 * Timezone Utilities
 *
 * All competition dates are stored and displayed in WIB (Asia/Jakarta, UTC+7).
 * This ensures consistency between admin dashboard and landing page countdown.
 */

export const WIB_TIMEZONE = 'Asia/Jakarta';
export const WIB_OFFSET_MS = 7 * 60 * 60 * 1000; // UTC+7 in milliseconds

/**
 * Get the current time as a "WIB-equivalent" Date object.
 * Returns a Date whose getHours/getMinutes/etc. return WIB time values,
 * regardless of the user's local timezone.
 *
 * Uses the Intl API's timezone-aware formatter to extract WIB components,
 * then constructs a clean Date from those components.
 */
export function nowWIB(): Date {
  const now = new Date();
  const parts = getWIBParts(now);
  return new Date(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
}

/**
 * Convert a UTC/ISO date string to a "WIB-equivalent" Date object.
 * Returns a Date whose getHours/getMinutes/etc. return WIB time values,
 * so it can be directly compared with nowWIB() for countdown calculations.
 */
export function toWIB(dateStr: string): Date {
  const date = new Date(dateStr);
  const parts = getWIBParts(date);
  return new Date(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
}

/**
 * Extract WIB date/time components from a Date using Intl.DateTimeFormat.
 * This is the most reliable cross-browser way to get timezone-specific values.
 */
function getWIBParts(date: Date): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: WIB_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => {
    const p = parts.find(p => p.type === type);
    return p ? parseInt(p.value, 10) : 0;
  };

  return {
    year: get('year'),
    month: get('month') - 1, // JS months are 0-indexed
    day: get('day'),
    hour: get('hour') === 24 ? 0 : get('hour'), // midnight can be 24 in some locales
    minute: get('minute'),
    second: get('second'),
  };
}

/**
 * Format a date string for display in WIB timezone.
 */
export function formatWIB(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleString('id-ID', {
    timeZone: WIB_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Create an ISO date string from a date input + time, treated as WIB.
 * Converts WIB local time to proper UTC ISO string for storage.
 *
 * @example createWIBISOString('2026-06-30', '23:59:59') → '2026-06-30T16:59:59.000Z'
 */
export function createWIBISOString(datePart: string, timePart: string = '23:59:59'): string {
  // WIB is UTC+7, so we subtract 7 hours to get UTC
  const utcDate = new Date(`${datePart}T${timePart}+07:00`);
  return utcDate.toISOString();
}

/**
 * Get the difference in milliseconds between now (in WIB) and a target date.
 * Handles timezone conversion automatically.
 */
export function diffFromNowWIB(targetDateStr: string): number {
  const now = nowWIB();
  const target = toWIB(targetDateStr);
  return target.getTime() - now.getTime();
}
