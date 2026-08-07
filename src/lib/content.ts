export function byLocale<T extends { id: string }>(entries: T[], lang: string): T[] {
  return entries.filter((e) => e.id.startsWith(lang + '/'));
}

export function slugOf(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/');
}

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function splitEvents<T extends { data: { eventDate: Date } }>(entries: T[], now: Date) {
  const upcoming = entries
    .filter((e) => e.data.eventDate.valueOf() >= now.valueOf())
    .sort((a, b) => a.data.eventDate.valueOf() - b.data.eventDate.valueOf());
  const past = entries
    .filter((e) => e.data.eventDate.valueOf() < now.valueOf())
    .sort((a, b) => b.data.eventDate.valueOf() - a.data.eventDate.valueOf());
  return { upcoming, past };
}
