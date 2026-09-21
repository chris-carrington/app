type TimeInput = number | string | Date;

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Values with a smaller magnitude than this are treated as epoch seconds. */
const EPOCH_SECONDS_CUTOFF = 1e11;

const clockFormat = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

// Now includes weekday so absolute dates read like
// "Wednesday, September 24, 2026"
const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function toDate(input: TimeInput): Date {
  if (input instanceof Date) return input;

  if (typeof input === 'number') {
    // 1_700_000_000 → seconds, 1_700_000_000_000 → milliseconds
    const ms = Math.abs(input) < EPOCH_SECONDS_CUTOFF ? input * SECOND : input;
    return new Date(ms);
  }

  return new Date(input);
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Whole calendar days between two instants (DST-safe). */
function calendarDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(from) - startOfDay(to)) / DAY);
}

export function formatTime(input: TimeInput, now: Date = new Date()): string {
  const date = toDate(input);

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('formatTime: could not parse the supplied date');
  }

  const elapsed = now.getTime() - date.getTime();

  // Also covers small future timestamps (clock skew).
  if (elapsed < 30 * SECOND) return 'Just now';

  let days = calendarDaysBetween(now, date);
  // Guard against future timestamps beyond the "Just now" window.
  if (days < 0) days = 0;

  // Same calendar day → use fine-grained relative time.
  if (days === 0) {
    if (elapsed < HOUR) {
      const minutes = Math.floor(elapsed / MINUTE);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    const hours = Math.floor(elapsed / HOUR);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Previous calendar day, regardless of how many hours ago that was.
  if (days === 1) return `Yesterday at ${clockFormat.format(date)}`;

  // 2–3 days ago stays relative.
  if (days < 4) return `${days} days ago at ${clockFormat.format(date)}`;

  // 4+ days ago → "Wednesday, September 24, 2026 at 9:30 PM"
  return `${dateFormat.format(date)} at ${clockFormat.format(date)}`;
}