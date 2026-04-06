/**
 * Timezone Utilities
 *
 * All competition dates are stored and displayed in WIB (Asia/Jakarta, UTC+7).
 * This ensures consistency between admin dashboard and landing page countdown.
 */

export const WIB_TIMEZONE = 'Asia/Jakarta';

/**
 * Get the current time in WIB as a Date object.
 * Works regardless of the user's local timezone.
 */
export function nowWIB(): Date {
  // Create a date string in WIB timezone, then parse it back to a Date
  const now = new Date();
  const wibStr = now.toLocaleString('en-US', { timeZone: WIB_TIMEZONE });
  return new Date(wibStr);
}

/**
 * Convert a UTC/ISO date string to a WIB Date object for comparison.
 * This ensures we compare "apples to apples" when calculating countdowns.
 */
export function toWIB(dateStr: string): Date {
  const date = new Date(dateStr);
  const wibStr = date.toLocaleString('en-US', { timeZone: WIB_TIMEZONE });
  return new Date(wibStr);
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
