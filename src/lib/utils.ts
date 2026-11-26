export function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}

export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

export function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 3_600_000).toISOString();
}

export function addDays(iso: string, n: number): string {
  return new Date(new Date(iso).getTime() + n * 86_400_000).toISOString();
}

/** Whole days from now until `iso` (0 if past). */
export function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

export function monthsBetween(fromIso: string, to = new Date()): number {
  const from = new Date(fromIso);
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

/** Short relative time, as in a feed: "5m", "3h", "2d", "4mo", "1y". */
export function timeAgoShort(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d`;
  if (s < 86400 * 30) return `${Math.floor(s / (86400 * 7))}w`;
  const m = monthsBetween(iso);
  return m < 12 ? `${Math.max(1, m)}mo` : `${Math.floor(m / 12)}y`;
}

/** Long relative duration: "3 days", "4 months", "1 year and 2 months". */
export function duration(iso: string): string {
  const m = monthsBetween(iso);
  if (m < 1) {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    return d <= 0 ? 'today' : `${d} day${d === 1 ? '' : 's'}`;
  }
  const y = Math.floor(m / 12);
  const r = m % 12;
  const ys = y ? `${y} year${y === 1 ? '' : 's'}` : '';
  const ms = r ? `${r} month${r === 1 ? '' : 's'}` : '';
  return [ys, ms].filter(Boolean).join(' and ');
}

export function formatDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function firstName(name: string): string {
  return name.split(' ')[0];
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export function navigate(path: string) {
  window.location.hash = path;
}
