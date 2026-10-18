import { describe, it, expect } from 'vitest';
import { profile, visibleProfiles, type Profile } from '../src/data/profile';

describe('profile content', () => {
  it('has three bio paragraphs and a tagline in both languages', () => {
    for (const lang of ['tr', 'en'] as const) {
      expect(profile[lang].tagline.length).toBeGreaterThan(10);
      expect(profile[lang].bio).toHaveLength(3);
    }
  });
  it('uses the Sabancı email', () => {
    expect(profile.email).toBe('hakan.mulayim@sabanciuniv.edu');
  });
});

describe('visibleProfiles', () => {
  it('drops empty links and keeps order', () => {
    const p: Profile = {
      ...profile,
      profiles: { linkedin: '', orcid: 'https://orcid.org/x', scholar: '', github: 'https://github.com/x' },
    };
    expect(visibleProfiles(p)).toEqual([
      { key: 'orcid', url: 'https://orcid.org/x' },
      { key: 'github', url: 'https://github.com/x' },
    ]);
  });
  it('returns [] when all empty', () => {
    expect(visibleProfiles(profile)).toEqual([]);
  });
});
