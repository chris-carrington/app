// app/src/lib/formatTimestamp.ts

export function formatTimestamp(iso: string): string {
  const date = new Date(iso)

  const parts: Intl.DateTimeFormatPart[] = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? ''

  const weekday = get('weekday')
  const month = get('month')
  const day = get('day')
  const year = get('year')
  const hour = get('hour')
  const minute = get('minute')
  const dayPeriod = get('dayPeriod').toUpperCase()

  return `${weekday}, ${month} ${day}, ${year} @ ${hour}:${minute}${dayPeriod}`
}
