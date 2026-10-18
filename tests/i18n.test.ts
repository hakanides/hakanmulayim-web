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
  it('maps home both ways', () => {
    expect(getAlternatePath('/')).toBe('/en/');
    expect(getAlternatePath('/en/')).toBe('/');
    expect(getAlternatePath('/en')).toBe('/');
  });
  it('sends every other path to the home of the other language', () => {
    expect(getAlternatePath('/hakkimda')).toBe('/en/');
    expect(getAlternatePath('/ders-notlari/limit-kavrami')).toBe('/en/');
    expect(getAlternatePath('/en/about')).toBe('/');
    expect(getAlternatePath('/en/blog/hello')).toBe('/');
  });
});
