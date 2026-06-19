import * as moment from 'moment-timezone';
import * as process from 'node:process';

export function formatDateTorfc3339(date: Date, timezone: string) {
  function pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  function timezoneOffset(offset: number) {
    if (offset === 0) {
      return 'Z';
    }

    const sign = offset < 0 ? '-' : '+';
    offset = Math.abs(offset);

    return sign + pad(Math.floor(offset / 60)) + ':' + pad(offset % 60);
  }

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    timezoneOffset(moment.tz(date, timezone).utcOffset())
  );
}

export function formatDateInTimezone(date: Date): string {
  const timezone = process.env.TIMEZONE || 'UTC';
  if (date !== null && date !== undefined) {
    const convertedDate = new Date(
      date.toLocaleString('en-US', { timeZone: timezone }),
    );
    return formatDateTorfc3339(convertedDate, timezone);
  } else {
    return null;
  }
}
