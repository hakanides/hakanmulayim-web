import { describe, it, expect } from 'vitest';
import { useTranslations, getLangFromUrl, defaultLang } from '../src/i18n/ui';
import { getAlternatePath } from '../src/i18n/routes';

describe('useTranslations', () => {
  it('returns Turkish strings for tr', () => {
    expect(useTranslations('tr')('nav.notes')).toBe('Ders Notları');
  });
  it('returns English strings for en', () => {
    expect(useTranslations('en')('nav.notes')).toBe('Notes');
  });
});

describe('getLangFromUrl', () => {
  it('detects en prefix', () => {
    expect(getLangFromUrl(new URL('https://x.com/en/about'))).toBe('en');
  });
  it('defaults to tr', () => {
    expect(getLangFromUrl(new URL('https://x.com/hakkimda'))).toBe('tr');
    expect(defaultLang).toBe('tr');
  });
});

describe('getAlternatePath', () => {
  it('maps tr pages to en counterparts', () => {
    expect(getAlternatePath('/')).toBe('/en/');
    expect(getAlternatePath('/cv')).toBe('/en/cv');
    expect(getAlternatePath('/arastirma')).toBe('/en/research');
    expect(getAlternatePath('/ogretim')).toBe('/en/teaching');
    expect(getAlternatePath('/iletisim/')).toBe('/en/contact');
  });
  it('maps en pages back to tr', () => {
    expect(getAlternatePath('/en/')).toBe('/');
    expect(getAlternatePath('/en')).toBe('/');
    expect(getAlternatePath('/en/research')).toBe('/arastirma');
    expect(getAlternatePath('/en/events')).toBe('/etkinlikler');
  });
  it('falls back to list page for detail routes', () => {
    expect(getAlternatePath('/ders-notlari/limit-kavrami')).toBe('/en/notes');
    expect(getAlternatePath('/en/blog/hello')).toBe('/blog');
  });
  it('falls back to home for unknown paths', () => {
    expect(getAlternatePath('/bilinmeyen')).toBe('/en/');
    expect(getAlternatePath('/en/unknown')).toBe('/');
  });
});
