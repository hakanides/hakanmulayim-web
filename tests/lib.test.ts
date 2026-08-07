import { describe, it, expect } from 'vitest';
import { byLocale, slugOf, sortByDateDesc, splitEvents } from '../src/lib/content';
import { formatDate } from '../src/lib/date';
import { NOTE_CATEGORIES } from '../src/lib/categories';

const d = (s: string) => new Date(s);

describe('byLocale & slugOf', () => {
  const entries = [
    { id: 'tr/limit-kavrami' },
    { id: 'en/limits' },
    { id: 'tr/arz-talep' },
  ];
  it('filters by locale prefix', () => {
    expect(byLocale(entries, 'tr').map((e) => e.id)).toEqual(['tr/limit-kavrami', 'tr/arz-talep']);
    expect(byLocale(entries, 'en')).toHaveLength(1);
  });
  it('strips locale from id', () => {
    expect(slugOf({ id: 'tr/limit-kavrami' })).toBe('limit-kavrami');
  });
});

describe('sortByDateDesc', () => {
  it('sorts newest first without mutating input', () => {
    const list = [
      { data: { date: d('2026-01-01') } },
      { data: { date: d('2026-06-01') } },
    ];
    const sorted = sortByDateDesc(list);
    expect(sorted[0].data.date).toEqual(d('2026-06-01'));
    expect(list[0].data.date).toEqual(d('2026-01-01'));
  });
});

describe('splitEvents', () => {
  const now = d('2026-07-17');
  const events = [
    { data: { eventDate: d('2026-09-15') } },
    { data: { eventDate: d('2026-05-01') } },
    { data: { eventDate: d('2026-08-01') } },
  ];
  it('splits and orders: upcoming asc, past desc', () => {
    const { upcoming, past } = splitEvents(events, now);
    expect(upcoming.map((e) => e.data.eventDate)).toEqual([d('2026-08-01'), d('2026-09-15')]);
    expect(past.map((e) => e.data.eventDate)).toEqual([d('2026-05-01')]);
  });
});

describe('formatDate', () => {
  it('formats per locale', () => {
    expect(formatDate(d('2026-07-17'), 'tr')).toBe('17 Temmuz 2026');
    expect(formatDate(d('2026-07-17'), 'en')).toBe('July 17, 2026');
  });
});

describe('NOTE_CATEGORIES', () => {
  it('matches the spec list exactly', () => {
    expect([...NOTE_CATEGORIES]).toEqual(['AP', 'IB', 'SAT', 'TMUA', 'Olimpiyat', 'Matematik', 'Ekonomi']);
  });
});
