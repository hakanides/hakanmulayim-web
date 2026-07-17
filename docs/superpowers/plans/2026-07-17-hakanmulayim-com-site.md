# hakanmulayim.com Kişisel Site — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** hakanmulayim.com'da yayınlanacak iki dilli (TR varsayılan + EN), sade-akademik kişisel site: Ana sayfa, Hakkımda, CV, Ders Notları (KaTeX + PDF), Blog, Etkinlikler, İletişim.

**Architecture:** Astro 5 tam statik çıktı; içerik Markdown content collections'ta (`src/content/{notes,blog,events}/{tr,en}/`); sayfa gövdeleri `src/components/pages/` altında dil parametresi alan paylaşımlı bileşenler (TR ve EN sayfaları ince sarmalayıcılar — DRY). Hosting: Cloudflare Pages (GitHub push → otomatik deploy). DNS: GoDaddy'de nameserver'lar Cloudflare'e yönlendirilir.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), KaTeX (remark-math + rehype-katex), @astrojs/sitemap, Vitest (saf TS yardımcıları için), jspdf (yalnızca placeholder PDF üretimi, devDependency).

**Spec:** `docs/superpowers/specs/2026-07-17-hakanmulayim-com-design.md` — kabul kriterleri Bölüm 8.

## Global Constraints

- Çalışma dizini: `/Users/hakanmulayim/hakanmulayim_web` (git repo mevcut, `main` dalı; spec commit'lenmiş durumda)
- Ortam (doğrulandı 2026-07-17): Node v25.8.0, npm 11.11.0, git 2.50.1, gh CLI 2.85.0. **gh oturumu bozuk** ("hakanides" hesabı keyring hatası) — Task 12'de yeniden giriş yapılacak.
- `site: 'https://hakanmulayim.com'` — tüm mutlak URL'ler bu köke göre
- Diller: TR varsayılan ve **ön eksiz** (`/hakkimda`), EN `/en/` ön ekli (`/en/about`). `prefixDefaultLocale: false`
- Not kategorileri (tam liste, birebir): `AP`, `IB`, `SAT`, `TMUA`, `Olimpiyat`, `Matematik`, `Ekonomi`
- İletişim e-postası: `hakanmulaym@gmail.com`. WhatsApp numarası, Calendly URL'i ve Web3Forms anahtarı Task 15'te kullanıcıdan alınır; **boş oldukları sürece ilgili blok render edilmez**
- Tüm placeholder içerikler açıkça örnek olarak işaretlenir (başlıkta veya metinde "örnek" ibaresi)
- İçerik dosya adları ASCII (Türkçe karakter yok) — slug'lar URL'ye gider
- Tasarım: sade-akademik — serif başlıklar, sans gövde, tek vurgu rengi `#1e3a5f` (koyu lacivert), bol beyaz alan, karanlık mod `prefers-color-scheme` ile otomatik
- **Güvenlik sınırı (Chrome destekli görevler, Task 12-15):** Hesap oluşturma, şifre girme, sözleşme/onay tıklama, ödeme — her zaman KULLANICI yapar. Claude yönlendirir, sayfayı okur, kullanıcının yapacağı adımı tarif eder; kimlik bilgisi alanlarına asla veri girmez. Mesaj gönderme / yayınlama / form submit niteliğindeki geri dönülmez tıklamalar için kullanıcıdan sohbet içinde onay alınır.
- Commit mesajları İngilizce, `feat:`/`chore:`/`docs:` önekli; her task kendi commit'iyle biter
- Git kimliği Task 1'de yerel olarak ayarlanır: `Hakan Mülayim <hakanmulaym@gmail.com>`

## Dosya Haritası (tamamlandığında)

```
astro.config.mjs, tsconfig.json, package.json, .gitignore
public/: favicon.svg, robots.txt, pdf/notes/limit-kavrami-ap-calculus.pdf
scripts/make-placeholder-pdfs.mjs
src/
  config.ts                      # iletişim/entegrasyon ayarları (boş=gizli)
  content.config.ts              # notes/blog/events koleksiyon şemaları
  styles/global.css              # Tailwind 4 + tema token'ları
  i18n/ui.ts                     # sözlükler + useTranslations + getLangFromUrl
  i18n/routes.ts                 # TR<->EN yol eşlemesi + getAlternatePath
  lib/categories.ts              # NOTE_CATEGORIES
  lib/content.ts                 # byLocale, slugOf, sortByDateDesc, splitEvents
  lib/date.ts                    # formatDate
  layouts/Base.astro             # head/SEO/hreflang + Header + Footer
  components/: Header.astro, Footer.astro, NoteCard.astro, PostCard.astro, EventCard.astro
  components/pages/: Home, About, Cv, NotesIndex, NoteDetail, BlogIndex, BlogPost, Events, Contact (.astro, hepsi lang prop'lu)
  pages/: index, hakkimda, cv, ders-notlari/{index,[slug]}, blog/{index,[slug]}, etkinlikler, iletisim, 404 (.astro)
  pages/en/: index, about, cv, notes/{index,[slug]}, blog/{index,[slug]}, events, contact (.astro)
  content/: notes/{tr,en}/*.md, blog/{tr,en}/*.md, events/{tr,en}/*.md
tests/: i18n.test.ts, lib.test.ts
docs/dns-backup-godaddy.md       # Task 14'te oluşturulur
```

---

### Task 1: Proje iskeleti ve araç zinciri

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`, `src/pages/index.astro` (geçici), `public/favicon.svg`

**Interfaces:**
- Produces: `npm run build` → `dist/`; `npm test` → vitest; tema token'ları `--color-accent`, `--font-serif` (global.css)

- [ ] **Step 1: Git kimliğini yerel ayarla**

```bash
cd /Users/hakanmulayim/hakanmulayim_web
git config user.name "Hakan Mülayim"
git config user.email "hakanmulaym@gmail.com"
```

- [ ] **Step 2: package.json ve .gitignore yaz**

`package.json`:
```json
{
  "name": "hakanmulayim-web",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  }
}
```

`.gitignore`:
```
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 3: Bağımlılıkları kur**

```bash
npm install astro @astrojs/sitemap tailwindcss @tailwindcss/vite remark-math rehype-katex katex
npm install -D vitest jspdf
```
Beklenen: hatasız biter; `package.json` dependencies dolar (Astro ^5.x).

- [ ] **Step 4: astro.config.mjs yaz**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://hakanmulayim.com',
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 5: tsconfig.json yaz**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: global.css yaz** (`src/styles/global.css`)

```css
@import "tailwindcss";

@theme {
  --color-accent: #1e3a5f;
  --color-accent-light: #2d5385;
  --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

body {
  font-family: var(--font-sans);
}

h1, h2, h3, h4 {
  font-family: var(--font-serif);
}

/* Markdown gövdesi için okunaklı satır aralığı */
.prose-body :is(p, ul, ol) { margin-block: 0.75rem; line-height: 1.7; }
.prose-body :is(h2) { margin-top: 2rem; font-size: 1.4rem; }
.prose-body :is(h3) { margin-top: 1.5rem; font-size: 1.15rem; }
.prose-body a { color: var(--color-accent); text-decoration: underline; }
.prose-body .katex-display { overflow-x: auto; padding-block: 0.25rem; }
```

- [ ] **Step 7: Geçici ana sayfa ve favicon yaz**

`src/pages/index.astro`:
```astro
---
import '../styles/global.css';
---
<html lang="tr"><head><meta charset="utf-8" /><title>Hakan Mülayim</title></head>
<body><h1>Kurulum sürüyor</h1></body></html>
```

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1e3a5f"/><text x="32" y="43" font-family="Georgia, serif" font-size="26" fill="#ffffff" text-anchor="middle">HM</text></svg>
```

- [ ] **Step 8: Build'in çalıştığını doğrula**

```bash
npm run build && test -f dist/index.html && echo BUILD_OK
```
Beklenen: `BUILD_OK`.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro 5 project with Tailwind 4, KaTeX, sitemap"
```

---

### Task 2: i18n temeli — sözlükler ve yol eşlemesi (TDD)

**Files:**
- Create: `src/i18n/ui.ts`, `src/i18n/routes.ts`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Produces: `type Lang = 'tr' | 'en'`; `defaultLang: Lang`; `useTranslations(lang: Lang): (key: UiKey) => string`; `getLangFromUrl(url: URL): Lang`; `routeMap: Record<string, string>`; `getAlternatePath(path: string): string`

- [ ] **Step 1: Başarısız testleri yaz** (`tests/i18n.test.ts`)

```ts
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
    expect(getAlternatePath('/hakkimda')).toBe('/en/about');
    expect(getAlternatePath('/ders-notlari')).toBe('/en/notes');
    expect(getAlternatePath('/iletisim/')).toBe('/en/contact'); // sondaki / normalize
  });
  it('maps en pages back to tr', () => {
    expect(getAlternatePath('/en/')).toBe('/');
    expect(getAlternatePath('/en')).toBe('/');
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
```

- [ ] **Step 2: Testlerin başarısız olduğunu gör**

```bash
npm test
```
Beklenen: FAIL — `Cannot find module '../src/i18n/ui'`.

- [ ] **Step 3: src/i18n/ui.ts yaz**

```ts
export const languages = { tr: 'Türkçe', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'tr';

export const ui = {
  tr: {
    'site.title': 'Hakan Mülayim',
    'site.tagline': 'Akademisyen · Matematik & Ekonomi Eğitmeni',
    'site.description':
      'Akademisyen; AP, IB, SAT, TMUA için Matematik & Ekonomi eğitmeni; Ekonomi Olimpiyatı eğitmeni. Ders notları, blog ve etkinlik duyuruları.',
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.cv': 'CV',
    'nav.notes': 'Ders Notları',
    'nav.blog': 'Blog',
    'nav.events': 'Etkinlikler',
    'nav.contact': 'İletişim',
    'home.heroLead':
      'Uluslararası sınavlara (AP, IB, SAT, TMUA) hazırlanan öğrenciler için Matematik & Ekonomi eğitimi; Ekonomi Olimpiyatı hazırlığı ve akademik çalışmalar.',
    'home.latestNotes': 'Son Ders Notları',
    'home.latestPosts': 'Son Yazılar',
    'home.viewAll': 'Tümünü gör',
    'home.cta': 'Ders talebi için iletişime geçin',
    'notes.title': 'Ders Notları',
    'notes.intro': 'Sınav ve konu bazlı ders notları. Kategoriye göre filtreleyebilirsiniz.',
    'notes.all': 'Tümü',
    'notes.download': 'PDF indir',
    'notes.empty': 'Bu dilde henüz not eklenmedi.',
    'blog.title': 'Blog',
    'blog.intro': 'Matematik, ekonomi ve eğitim üzerine yazılar.',
    'blog.empty': 'Henüz yazı yok.',
    'events.title': 'Etkinlikler',
    'events.upcoming': 'Yaklaşan Etkinlikler',
    'events.past': 'Geçmiş Etkinlikler',
    'events.register': 'Kayıt / Detay',
    'events.empty': 'Şu anda duyurulmuş etkinlik yok.',
    'about.title': 'Hakkımda',
    'cv.title': 'CV',
    'cv.download': 'PDF olarak indir',
    'cv.education': 'Eğitim',
    'cv.experience': 'Deneyim',
    'cv.publications': 'Yayınlar',
    'contact.title': 'İletişim',
    'contact.intro':
      'Özel ders talebi, ders notları veya etkinlikler hakkında sorularınız için ulaşabilirsiniz.',
    'contact.email': 'E-posta',
    'contact.whatsapp': 'WhatsApp ile yaz',
    'contact.calendly': 'Randevu al',
    'contact.form.name': 'Ad Soyad',
    'contact.form.email': 'E-posta adresiniz',
    'contact.form.subject': 'Konu',
    'contact.form.message': 'Mesajınız',
    'contact.form.send': 'Gönder',
    'footer.note': 'Bu sitedeki notlar eğitim amaçlıdır.',
    'notFound.title': 'Sayfa bulunamadı',
    'notFound.back': 'Ana sayfaya dön',
  },
  en: {
    'site.title': 'Hakan Mülayim',
    'site.tagline': 'Academic · Mathematics & Economics Educator',
    'site.description':
      'Academic; Mathematics & Economics tutor for AP, IB, SAT, TMUA; Economics Olympiad coach. Lecture notes, blog and event announcements.',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.cv': 'CV',
    'nav.notes': 'Notes',
    'nav.blog': 'Blog',
    'nav.events': 'Events',
    'nav.contact': 'Contact',
    'home.heroLead':
      'Mathematics & Economics education for students preparing for international exams (AP, IB, SAT, TMUA); Economics Olympiad training and academic work.',
    'home.latestNotes': 'Latest Notes',
    'home.latestPosts': 'Latest Posts',
    'home.viewAll': 'View all',
    'home.cta': 'Get in touch for tutoring',
    'notes.title': 'Lecture Notes',
    'notes.intro': 'Notes organised by exam and topic. Filter by category.',
    'notes.all': 'All',
    'notes.download': 'Download PDF',
    'notes.empty': 'No notes in this language yet.',
    'blog.title': 'Blog',
    'blog.intro': 'Writing on mathematics, economics and education.',
    'blog.empty': 'No posts yet.',
    'events.title': 'Events',
    'events.upcoming': 'Upcoming Events',
    'events.past': 'Past Events',
    'events.register': 'Register / Details',
    'events.empty': 'No events announced right now.',
    'about.title': 'About',
    'cv.title': 'CV',
    'cv.download': 'Download PDF',
    'cv.education': 'Education',
    'cv.experience': 'Experience',
    'cv.publications': 'Publications',
    'contact.title': 'Contact',
    'contact.intro':
      'Reach out for tutoring requests, questions about the notes, or events.',
    'contact.email': 'Email',
    'contact.whatsapp': 'Message on WhatsApp',
    'contact.calendly': 'Book a call',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Your email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your message',
    'contact.form.send': 'Send',
    'footer.note': 'Notes on this site are for educational purposes.',
    'notFound.title': 'Page not found',
    'notFound.back': 'Back to home',
  },
} as const;

export type UiKey = keyof (typeof ui)['tr'];

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : 'tr';
}
```

- [ ] **Step 4: src/i18n/routes.ts yaz**

```ts
/** TR yolu -> EN yolu. Ana sayfa '/en/' (sondaki / önemli, Astro dizin formatı). */
export const routeMap: Record<string, string> = {
  '/': '/en/',
  '/hakkimda': '/en/about',
  '/cv': '/en/cv',
  '/ders-notlari': '/en/notes',
  '/blog': '/en/blog',
  '/etkinlikler': '/en/events',
  '/iletisim': '/en/contact',
};

/**
 * Mevcut yolun diğer dildeki karşılığını döndürür.
 * Detay sayfaları (slug'lı) diğer dilin liste sayfasına düşer;
 * detay sayfası kendi birebir karşılığını biliyorsa Base'e altPath prop'u ile geçer.
 */
export function getAlternatePath(path: string): string {
  let clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  if (clean === '' ) clean = '/';
  if (clean === '/') return '/en/';
  if (clean === '/en') return '/';

  if (!clean.startsWith('/en/')) {
    if (routeMap[clean]) return routeMap[clean];
    if (clean.startsWith('/ders-notlari/')) return '/en/notes';
    if (clean.startsWith('/blog/')) return '/en/blog';
    return '/en/';
  }

  const trEntry = Object.entries(routeMap).find(([, en]) => en === clean);
  if (trEntry) return trEntry[0];
  if (clean.startsWith('/en/notes/')) return '/ders-notlari';
  if (clean.startsWith('/en/blog/')) return '/blog';
  return '/';
}
```

- [ ] **Step 5: Testlerin geçtiğini gör**

```bash
npm test
```
Beklenen: PASS (tümü yeşil).

- [ ] **Step 6: Commit**

```bash
git add src/i18n tests/i18n.test.ts && git commit -m "feat: i18n dictionaries and TR/EN route mapping"
```

---

### Task 3: İçerik yardımcıları — sıralama, dil filtresi, tarih (TDD)

**Files:**
- Create: `src/lib/categories.ts`, `src/lib/content.ts`, `src/lib/date.ts`
- Test: `tests/lib.test.ts`

**Interfaces:**
- Produces: `NOTE_CATEGORIES: readonly ['AP','IB','SAT','TMUA','Olimpiyat','Matematik','Ekonomi']`; `byLocale<T extends {id:string}>(entries: T[], lang: string): T[]`; `slugOf(entry: {id:string}): string`; `sortByDateDesc<T extends {data:{date:Date}}>(entries: T[]): T[]`; `splitEvents<T extends {data:{eventDate:Date}}>(entries: T[], now: Date): {upcoming: T[], past: T[]}`; `formatDate(date: Date, lang: 'tr'|'en'): string`
- Not: yardımcılar `astro:content` import ETMEZ (Vitest'te saf çalışır); koleksiyon entry'leri yapısal olarak uyumludur (`id`, `data`).

- [ ] **Step 1: Başarısız testleri yaz** (`tests/lib.test.ts`)

```ts
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
```

- [ ] **Step 2: Testlerin başarısız olduğunu gör**

```bash
npm test
```
Beklenen: FAIL — `Cannot find module '../src/lib/content'`.

- [ ] **Step 3: Üç yardımcı dosyayı yaz**

`src/lib/categories.ts`:
```ts
export const NOTE_CATEGORIES = ['AP', 'IB', 'SAT', 'TMUA', 'Olimpiyat', 'Matematik', 'Ekonomi'] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];
```

`src/lib/content.ts`:
```ts
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
```

`src/lib/date.ts`:
```ts
export function formatDate(date: Date, lang: 'tr' | 'en'): string {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
```

- [ ] **Step 4: Testlerin geçtiğini gör**

```bash
npm test
```
Beklenen: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib tests/lib.test.ts && git commit -m "feat: content helpers (locale filter, sorting, event split, date format)"
```

---

### Task 4: İçerik koleksiyonları, placeholder içerik ve placeholder PDF

**Files:**
- Create: `src/content.config.ts`, `src/config.ts`, `scripts/make-placeholder-pdfs.mjs`
- Create (içerik): `src/content/notes/tr/limit-kavrami-ap-calculus.md`, `src/content/notes/tr/tmua-mantik-ornek.md`, `src/content/notes/tr/arz-talep-esneklik.md`, `src/content/notes/en/limits-ap-calculus.md`, `src/content/blog/tr/merhaba.md`, `src/content/blog/en/hello.md`, `src/content/events/tr/ekonomi-olimpiyati-bilgilendirme-2026.md`, `src/content/events/en/econ-olympiad-info-2026.md`
- Create (üretilen): `public/pdf/notes/limit-kavrami-ap-calculus.pdf`

**Interfaces:**
- Consumes: `NOTE_CATEGORIES` (Task 3)
- Produces: koleksiyonlar `notes` (şema: `title, description, date, category, pdf?, draft`), `blog` (`title, description, date, tags[], draft`), `events` (`title, description, eventDate, location?, registrationUrl?, draft`); entry id'leri `tr/<slug>` / `en/<slug>` biçiminde. `src/config.ts` → `contact = { email, whatsappNumber, calendlyUrl, web3formsKey }`, `cvPdfUrl: string`

- [ ] **Step 1: src/content.config.ts yaz**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { NOTE_CATEGORIES } from './lib/categories';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(NOTE_CATEGORIES),
    pdf: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eventDate: z.coerce.date(),
    location: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, blog, events };
```

- [ ] **Step 2: src/config.ts yaz**

```ts
/**
 * İletişim ve entegrasyon ayarları.
 * Boş string = ilgili blok sitede GÖSTERİLMEZ. Task 15'te doldurulur.
 */
export const contact = {
  email: 'hakanmulaym@gmail.com',
  /** Uluslararası format, + ve boşluk olmadan, ör. '905321234567' */
  whatsappNumber: '',
  /** ör. 'https://calendly.com/hakanmulayim/30dk' */
  calendlyUrl: '',
  /** Web3Forms access key (public anahtar, HTML'e gömülür) */
  web3formsKey: '',
};

/** ör. '/cv/hakan-mulayim-cv.pdf' — public/cv/ altına PDF konunca doldur */
export const cvPdfUrl = '';
```

- [ ] **Step 3: Placeholder not içeriklerini yaz**

`src/content/notes/tr/limit-kavrami-ap-calculus.md`:
```markdown
---
title: "Limit Kavramı — AP Calculus (Örnek Not)"
description: "Limitin sezgisel ve formel tanımı, tek taraflı limitler ve örnek sorular."
date: 2026-07-10
category: "AP"
pdf: "/pdf/notes/limit-kavrami-ap-calculus.pdf"
---

> Bu bir **örnek nottur**; gerçek içerik eklenene kadar yer tutucudur.

## Sezgisel Tanım

Bir $f$ fonksiyonunun $x = a$ noktasındaki limiti, $x$ değerleri $a$'ya
yaklaşırken $f(x)$ değerlerinin yaklaştığı sayıdır:

$$\lim_{x \to a} f(x) = L$$

## Formel ($\varepsilon$–$\delta$) Tanım

Her $\varepsilon > 0$ için öyle bir $\delta > 0$ vardır ki
$0 < |x - a| < \delta$ olduğunda $|f(x) - L| < \varepsilon$ olur.

## Örnek

$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} (x + 2) = 4$$
```

`src/content/notes/tr/tmua-mantik-ornek.md`:
```markdown
---
title: "TMUA Mantık ve İspat — Örnek Sorular (Örnek Not)"
description: "TMUA Paper 2 tarzı mantık, gereklilik-yeterlilik ve ispat değerlendirme soruları."
date: 2026-07-05
category: "TMUA"
---

> Bu bir **örnek nottur**; gerçek içerik eklenene kadar yer tutucudur.

## Gereklilik ve Yeterlilik

"$P \Rightarrow Q$" doğruysa: $P$, $Q$ için **yeterli**; $Q$, $P$ için **gereklidir**.

## Örnek Soru

$n^2$ çift ise $n$ çifttir — ispatın kontrapozitif ile kurulması beklenir.
```

`src/content/notes/tr/arz-talep-esneklik.md`:
```markdown
---
title: "Arz, Talep ve Esneklik (Örnek Not)"
description: "Talep esnekliği, toplam hasılat ilişkisi ve olimpiyat düzeyi örnekler."
date: 2026-06-28
category: "Ekonomi"
---

> Bu bir **örnek nottur**; gerçek içerik eklenene kadar yer tutucudur.

## Fiyat Esnekliği

$$E_d = \frac{\%\Delta Q_d}{\%\Delta P}$$

$|E_d| > 1$ ise talep esnektir; fiyat artışı toplam hasılatı düşürür.
```

`src/content/notes/en/limits-ap-calculus.md`:
```markdown
---
title: "The Concept of a Limit — AP Calculus (Sample Note)"
description: "Intuitive and formal definitions of limits, one-sided limits and worked examples."
date: 2026-07-10
category: "AP"
pdf: "/pdf/notes/limit-kavrami-ap-calculus.pdf"
---

> This is a **sample note** — placeholder until real content is added.

## Intuitive Definition

$$\lim_{x \to a} f(x) = L$$

## Worked Example

$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} (x + 2) = 4$$
```

- [ ] **Step 4: Placeholder blog ve etkinlik içeriklerini yaz**

`src/content/blog/tr/merhaba.md`:
```markdown
---
title: "Merhaba (Örnek Yazı)"
description: "Bu sitenin amacı ve yayın planı üzerine kısa bir açılış yazısı."
date: 2026-07-12
tags: ["duyuru"]
---

> Bu bir **örnek yazıdır**; gerçek içerik eklenene kadar yer tutucudur.

Bu sitede ders notları, sınav stratejileri ve ekonomi-matematik üzerine
yazılar paylaşacağım.
```

`src/content/blog/en/hello.md`:
```markdown
---
title: "Hello (Sample Post)"
description: "A short opening post about the purpose of this site."
date: 2026-07-12
tags: ["announcement"]
---

> This is a **sample post** — placeholder until real content is added.

I will share lecture notes, exam strategies and writing on mathematics
and economics here.
```

`src/content/events/tr/ekonomi-olimpiyati-bilgilendirme-2026.md`:
```markdown
---
title: "Ekonomi Olimpiyatı Hazırlık Bilgilendirmesi (Örnek Etkinlik)"
description: "2026-27 dönemi olimpiyat hazırlık grubu için tanıtım oturumu."
eventDate: 2026-09-15
location: "Çevrimiçi (Zoom)"
---

> Bu bir **örnek etkinliktir**; gerçek duyuru eklenene kadar yer tutucudur.

Hazırlık programının kapsamı, takvimi ve başvuru koşulları anlatılacaktır.
```

`src/content/events/en/econ-olympiad-info-2026.md`:
```markdown
---
title: "Economics Olympiad Prep — Info Session (Sample Event)"
description: "Introductory session for the 2026-27 olympiad preparation group."
eventDate: 2026-09-15
location: "Online (Zoom)"
---

> This is a **sample event** — placeholder until a real announcement is added.
```

- [ ] **Step 5: Placeholder PDF üret**

`scripts/make-placeholder-pdfs.mjs`:
```js
import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'node:fs';

const doc = new jsPDF();
doc.setFontSize(18);
doc.text('Ornek Ders Notu - Placeholder', 20, 30);
doc.setFontSize(12);
doc.text('Bu PDF, gercek icerik eklenene kadar yer tutucudur.', 20, 45);
doc.text('hakanmulayim.com', 20, 55);
mkdirSync('public/pdf/notes', { recursive: true });
writeFileSync(
  'public/pdf/notes/limit-kavrami-ap-calculus.pdf',
  Buffer.from(doc.output('arraybuffer'))
);
console.log('PDF_OK');
```

```bash
node scripts/make-placeholder-pdfs.mjs
```
Beklenen: `PDF_OK`; `public/pdf/notes/limit-kavrami-ap-calculus.pdf` oluşur (~5-10 KB).

- [ ] **Step 6: Şema ve içeriğin derlendiğini doğrula**

```bash
npx astro sync && npm run build && echo CONTENT_OK
```
Beklenen: `CONTENT_OK`. Şema ihlali olsaydı zod hatası verirdi (ör. geçersiz `category`).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: content collections with placeholder notes, posts, events and PDF"
```

---

### Task 5: Base layout, Header/Footer ve kart bileşenleri

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/NoteCard.astro`, `src/components/PostCard.astro`, `src/components/EventCard.astro`

**Interfaces:**
- Consumes: `useTranslations`, `getLangFromUrl`, `Lang` (Task 2); `getAlternatePath` (Task 2); `formatDate` (Task 3); `slugOf` (Task 3)
- Produces: `Base.astro` props: `{ title: string; description: string; lang: Lang; altPath?: string }` — head/SEO/hreflang üretir, Header+Footer sarar. `NoteCard` props: `{ entry, lang }` (entry: notes koleksiyonu entry'si); `PostCard` props: `{ entry, lang }`; `EventCard` props: `{ entry, lang }`

- [ ] **Step 1: Base.astro yaz**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getAlternatePath } from '../i18n/routes';
import type { Lang } from '../i18n/ui';

interface Props {
  title: string;
  description: string;
  lang: Lang;
  altPath?: string;
}
const { title, description, lang, altPath } = Astro.props;

const path = Astro.url.pathname;
const alternate = altPath ?? getAlternatePath(path);
const site = Astro.site!.origin;
const trUrl = lang === 'tr' ? site + path : site + alternate;
const enUrl = lang === 'en' ? site + path : site + alternate;
const pageTitle = title === 'Hakan Mülayim' ? title : `${title} — Hakan Mülayim`;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={site + path} />
    <link rel="alternate" hreflang="tr" href={trUrl} />
    <link rel="alternate" hreflang="en" href={enUrl} />
    <link rel="alternate" hreflang="x-default" href={trUrl} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={site + path} />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body class="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200">
    <Header lang={lang} altPath={alternate} />
    <main class="flex-1 w-full max-w-3xl mx-auto px-5 py-10">
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 2: Header.astro yaz**

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';

interface Props { lang: Lang; altPath: string }
const { lang, altPath } = Astro.props;
const t = useTranslations(lang);

const links =
  lang === 'tr'
    ? [
        ['/', t('nav.home')],
        ['/hakkimda', t('nav.about')],
        ['/cv', t('nav.cv')],
        ['/ders-notlari', t('nav.notes')],
        ['/blog', t('nav.blog')],
        ['/etkinlikler', t('nav.events')],
        ['/iletisim', t('nav.contact')],
      ]
    : [
        ['/en/', t('nav.home')],
        ['/en/about', t('nav.about')],
        ['/en/cv', t('nav.cv')],
        ['/en/notes', t('nav.notes')],
        ['/en/blog', t('nav.blog')],
        ['/en/events', t('nav.events')],
        ['/en/contact', t('nav.contact')],
      ];
const current = Astro.url.pathname.replace(/\/$/, '') || '/';
---
<header class="border-b border-gray-200 dark:border-gray-800">
  <div class="max-w-3xl mx-auto px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
    <a href={lang === 'tr' ? '/' : '/en/'} class="font-serif text-lg font-semibold text-accent dark:text-gray-100">
      Hakan Mülayim
    </a>
    <nav class="flex flex-wrap gap-x-4 gap-y-1 text-sm ml-auto items-center">
      {links.map(([href, label]) => (
        <a
          href={href}
          aria-current={current === (href as string).replace(/\/$/, '') || (href === '/' && current === '/') ? 'page' : undefined}
          class="hover:text-accent dark:hover:text-white aria-[current=page]:font-semibold aria-[current=page]:text-accent dark:aria-[current=page]:text-white"
        >
          {label}
        </a>
      ))}
      <a
        href={altPath}
        class="ml-2 px-2 py-0.5 border border-gray-300 dark:border-gray-700 rounded text-xs font-medium hover:border-accent"
        aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
      >
        {lang === 'tr' ? 'EN' : 'TR'}
      </a>
    </nav>
  </div>
</header>
```

- [ ] **Step 3: Footer.astro yaz**

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const year = new Date().getFullYear();
---
<footer class="border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
  <div class="max-w-3xl mx-auto px-5 py-6 flex flex-wrap justify-between gap-2">
    <span>© {year} Hakan Mülayim</span>
    <span>{t('footer.note')}</span>
  </div>
</footer>
```

- [ ] **Step 4: NoteCard.astro yaz**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '../lib/date';
import { slugOf } from '../lib/content';
import type { Lang } from '../i18n/ui';

interface Props { entry: CollectionEntry<'notes'>; lang: Lang }
const { entry, lang } = Astro.props;
const href = (lang === 'tr' ? '/ders-notlari/' : '/en/notes/') + slugOf(entry);
---
<article data-note-card data-category={entry.data.category} class="py-4 border-b border-gray-100 dark:border-gray-800">
  <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
    <span class="px-1.5 py-0.5 rounded bg-accent/10 text-accent dark:bg-accent-light/20 dark:text-gray-200 font-medium">
      {entry.data.category}
    </span>
    <time datetime={entry.data.date.toISOString()}>{formatDate(entry.data.date, lang)}</time>
  </div>
  <h3 class="mt-1 text-lg font-semibold">
    <a href={href} class="hover:text-accent dark:hover:text-white">{entry.data.title}</a>
  </h3>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{entry.data.description}</p>
</article>
```

- [ ] **Step 5: PostCard.astro yaz**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '../lib/date';
import { slugOf } from '../lib/content';
import type { Lang } from '../i18n/ui';

interface Props { entry: CollectionEntry<'blog'>; lang: Lang }
const { entry, lang } = Astro.props;
const href = (lang === 'tr' ? '/blog/' : '/en/blog/') + slugOf(entry);
---
<article class="py-4 border-b border-gray-100 dark:border-gray-800">
  <time class="text-xs text-gray-500 dark:text-gray-400" datetime={entry.data.date.toISOString()}>
    {formatDate(entry.data.date, lang)}
  </time>
  <h3 class="mt-1 text-lg font-semibold">
    <a href={href} class="hover:text-accent dark:hover:text-white">{entry.data.title}</a>
  </h3>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{entry.data.description}</p>
</article>
```

- [ ] **Step 6: EventCard.astro yaz**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '../lib/date';
import { useTranslations, type Lang } from '../i18n/ui';

interface Props { entry: CollectionEntry<'events'>; lang: Lang }
const { entry, lang } = Astro.props;
const t = useTranslations(lang);
---
<article class="py-4 border-b border-gray-100 dark:border-gray-800">
  <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
    <time datetime={entry.data.eventDate.toISOString()}>{formatDate(entry.data.eventDate, lang)}</time>
    {entry.data.location && <span>· {entry.data.location}</span>}
  </div>
  <h3 class="mt-1 text-lg font-semibold">{entry.data.title}</h3>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{entry.data.description}</p>
  {entry.data.registrationUrl && (
    <a href={entry.data.registrationUrl} class="inline-block mt-2 text-sm text-accent underline">
      {t('events.register')}
    </a>
  )}
</article>
```

- [ ] **Step 7: Build doğrula ve commit**

```bash
npm run build && echo LAYOUT_OK
git add src/layouts src/components && git commit -m "feat: base layout with SEO/hreflang, header, footer and card components"
```
Beklenen: `LAYOUT_OK` (bileşenler henüz sayfalarda kullanılmıyor; sadece derlenebilirlik).

---

### Task 6: Ana sayfa, Hakkımda, CV (paylaşımlı gövdeler + TR sayfaları)

**Files:**
- Create: `src/components/pages/Home.astro`, `src/components/pages/About.astro`, `src/components/pages/Cv.astro`
- Create: `src/pages/index.astro` (Task 1'deki geçici dosyanın üzerine yazılır), `src/pages/hakkimda.astro`, `src/pages/cv.astro`

**Interfaces:**
- Consumes: `Base.astro` (Task 5), kartlar (Task 5), `byLocale/sortByDateDesc` (Task 3), `useTranslations` (Task 2), `cvPdfUrl` (Task 4)
- Produces: `Home.astro`, `About.astro`, `Cv.astro` — hepsi props `{ lang: Lang }`. TR/EN page dosyaları bu gövdeleri sarar (EN Task 10'da).

- [ ] **Step 1: Home.astro yaz** (`src/components/pages/Home.astro`)

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import NoteCard from '../NoteCard.astro';
import PostCard from '../PostCard.astro';
import { byLocale, sortByDateDesc } from '../../lib/content';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);

const notes = sortByDateDesc(
  byLocale(await getCollection('notes', ({ data }) => !data.draft), lang)
).slice(0, 3);
const posts = sortByDateDesc(
  byLocale(await getCollection('blog', ({ data }) => !data.draft), lang)
).slice(0, 3);

const badges = ['AP', 'IB', 'SAT', 'TMUA', lang === 'tr' ? 'Ekonomi Olimpiyatı' : 'Economics Olympiad'];
const notesHref = lang === 'tr' ? '/ders-notlari' : '/en/notes';
const blogHref = lang === 'tr' ? '/blog' : '/en/blog';
const contactHref = lang === 'tr' ? '/iletisim' : '/en/contact';
---
<Base title="Hakan Mülayim" description={t('site.description')} lang={lang}>
  <section class="py-6">
    <h1 class="text-3xl sm:text-4xl font-semibold">Hakan Mülayim</h1>
    <p class="mt-2 text-lg text-accent dark:text-gray-300">{t('site.tagline')}</p>
    <p class="mt-4 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-400">{t('home.heroLead')}</p>
    <ul class="mt-4 flex flex-wrap gap-2">
      {badges.map((b) => (
        <li class="px-2.5 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-medium">{b}</li>
      ))}
    </ul>
    <a href={contactHref} class="inline-block mt-6 px-4 py-2 rounded bg-accent text-white text-sm font-medium hover:bg-accent-light">
      {t('home.cta')}
    </a>
  </section>

  <section class="mt-10">
    <div class="flex items-baseline justify-between">
      <h2 class="text-xl font-semibold">{t('home.latestNotes')}</h2>
      <a href={notesHref} class="text-sm text-accent underline">{t('home.viewAll')}</a>
    </div>
    {notes.map((entry) => <NoteCard entry={entry} lang={lang} />)}
  </section>

  <section class="mt-10">
    <div class="flex items-baseline justify-between">
      <h2 class="text-xl font-semibold">{t('home.latestPosts')}</h2>
      <a href={blogHref} class="text-sm text-accent underline">{t('home.viewAll')}</a>
    </div>
    {posts.map((entry) => <PostCard entry={entry} lang={lang} />)}
  </section>
</Base>
```

- [ ] **Step 2: About.astro yaz** (`src/components/pages/About.astro`)

```astro
---
import Base from '../../layouts/Base.astro';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<Base title={t('about.title')} description={t('site.description')} lang={lang}>
  <h1 class="text-3xl font-semibold">{t('about.title')}</h1>
  <div class="prose-body mt-6">
    {lang === 'tr' ? (
      <>
        <p><em>(Örnek metin — gerçek biyografi eklenene kadar yer tutucudur.)</em></p>
        <p>
          Akademik çalışmalarımın yanında AP, IB, SAT ve TMUA gibi uluslararası
          sınavlara hazırlanan öğrencilere Matematik ve Ekonomi eğitimi veriyorum;
          Ekonomi Olimpiyatı'na hazırlanan öğrencilerle çalışıyorum.
        </p>
        <h2>Uzmanlık Alanları</h2>
        <ul>
          <li>AP Calculus, AP Microeconomics / Macroeconomics</li>
          <li>IB Mathematics (AA/AI), IB Economics</li>
          <li>SAT Math, TMUA</li>
          <li>Ekonomi Olimpiyatı hazırlığı</li>
        </ul>
      </>
    ) : (
      <>
        <p><em>(Sample text — placeholder until the real biography is added.)</em></p>
        <p>
          Alongside my academic work, I teach Mathematics and Economics to
          students preparing for international exams such as AP, IB, SAT and
          TMUA, and I coach students preparing for the Economics Olympiad.
        </p>
        <h2>Areas of Expertise</h2>
        <ul>
          <li>AP Calculus, AP Micro/Macroeconomics</li>
          <li>IB Mathematics (AA/AI), IB Economics</li>
          <li>SAT Math, TMUA</li>
          <li>Economics Olympiad preparation</li>
        </ul>
      </>
    )}
  </div>
</Base>
```

- [ ] **Step 3: Cv.astro yaz** (`src/components/pages/Cv.astro`)

```astro
---
import Base from '../../layouts/Base.astro';
import { useTranslations, type Lang } from '../../i18n/ui';
import { cvPdfUrl } from '../../config';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<Base title={t('cv.title')} description={t('site.description')} lang={lang}>
  <div class="flex items-baseline justify-between">
    <h1 class="text-3xl font-semibold">{t('cv.title')}</h1>
    {cvPdfUrl && (
      <a href={cvPdfUrl} class="text-sm px-3 py-1.5 rounded bg-accent text-white hover:bg-accent-light">
        {t('cv.download')}
      </a>
    )}
  </div>
  <div class="prose-body mt-6">
    <p><em>{lang === 'tr'
      ? '(Örnek CV — gerçek bilgiler eklenene kadar yer tutucudur.)'
      : '(Sample CV — placeholder until real details are added.)'}</em></p>
    <h2>{t('cv.education')}</h2>
    <ul>
      <li>{lang === 'tr' ? 'Doktora / Yüksek Lisans — Alan, Üniversite (yıl)' : 'PhD / MSc — Field, University (year)'}</li>
      <li>{lang === 'tr' ? 'Lisans — Alan, Üniversite (yıl)' : 'BSc — Field, University (year)'}</li>
    </ul>
    <h2>{t('cv.experience')}</h2>
    <ul>
      <li>{lang === 'tr' ? 'Eğitmen — Matematik & Ekonomi (AP, IB, SAT, TMUA)' : 'Educator — Mathematics & Economics (AP, IB, SAT, TMUA)'}</li>
      <li>{lang === 'tr' ? 'Ekonomi Olimpiyatı eğitmenliği' : 'Economics Olympiad coaching'}</li>
    </ul>
    <h2>{t('cv.publications')}</h2>
    <ul>
      <li>{lang === 'tr' ? '(Yayınlar eklenecek)' : '(Publications to be added)'}</li>
    </ul>
  </div>
</Base>
```

- [ ] **Step 4: TR sayfalarını yaz**

`src/pages/index.astro` (üzerine yaz):
```astro
---
import Home from '../components/pages/Home.astro';
---
<Home lang="tr" />
```

`src/pages/hakkimda.astro`:
```astro
---
import About from '../components/pages/About.astro';
---
<About lang="tr" />
```

`src/pages/cv.astro`:
```astro
---
import Cv from '../components/pages/Cv.astro';
---
<Cv lang="tr" />
```

- [ ] **Step 5: Build doğrula**

```bash
npm run build \
  && grep -q 'Ekonomi Olimpiyatı' dist/index.html \
  && grep -q 'hreflang="en"' dist/index.html \
  && test -f dist/hakkimda/index.html \
  && test -f dist/cv/index.html \
  && echo PAGES1_OK
```
Beklenen: `PAGES1_OK`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: home, about and CV pages (shared bodies, TR wrappers)"
```

---

### Task 7: Ders notları — liste (kategori filtreli) ve detay (KaTeX + PDF)

**Files:**
- Create: `src/components/pages/NotesIndex.astro`, `src/components/pages/NoteDetail.astro`
- Create: `src/pages/ders-notlari/index.astro`, `src/pages/ders-notlari/[slug].astro`

**Interfaces:**
- Consumes: `NOTE_CATEGORIES` (Task 3), `byLocale/slugOf/sortByDateDesc` (Task 3), `NoteCard`/`Base` (Task 5), `render` (astro:content)
- Produces: `NotesIndex.astro` props `{ lang: Lang }`; `NoteDetail.astro` props `{ entry: CollectionEntry<'notes'>; lang: Lang; altPath?: string }`. `[slug].astro` getStaticPaths deseni: diğer dilde aynı slug varsa `altPath` üretir (Task 10 EN tarafında aynı desen).

- [ ] **Step 1: NotesIndex.astro yaz** (`src/components/pages/NotesIndex.astro`)

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import NoteCard from '../NoteCard.astro';
import { byLocale, sortByDateDesc } from '../../lib/content';
import { NOTE_CATEGORIES } from '../../lib/categories';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);

const notes = sortByDateDesc(
  byLocale(await getCollection('notes', ({ data }) => !data.draft), lang)
);
---
<Base title={t('notes.title')} description={t('notes.intro')} lang={lang}>
  <h1 class="text-3xl font-semibold">{t('notes.title')}</h1>
  <p class="mt-2 text-gray-600 dark:text-gray-400">{t('notes.intro')}</p>

  <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Kategori filtresi">
    <button data-filter="all" aria-pressed="true"
      class="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-medium aria-[pressed=true]:bg-accent aria-[pressed=true]:text-white aria-[pressed=true]:border-accent">
      {t('notes.all')}
    </button>
    {NOTE_CATEGORIES.map((cat) => (
      <button data-filter={cat} aria-pressed="false"
        class="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-medium aria-[pressed=true]:bg-accent aria-[pressed=true]:text-white aria-[pressed=true]:border-accent">
        {cat}
      </button>
    ))}
  </div>

  <div class="mt-4">
    {notes.length === 0 && <p class="text-gray-500">{t('notes.empty')}</p>}
    {notes.map((entry) => <NoteCard entry={entry} lang={lang} />)}
  </div>

  <script>
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        document.querySelectorAll<HTMLElement>('[data-note-card]').forEach((card) => {
          card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
        });
      });
    });
  </script>
</Base>
```

- [ ] **Step 2: NoteDetail.astro yaz** (`src/components/pages/NoteDetail.astro`)

```astro
---
import { render, type CollectionEntry } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { formatDate } from '../../lib/date';
import { useTranslations, type Lang } from '../../i18n/ui';
import 'katex/dist/katex.min.css';

interface Props { entry: CollectionEntry<'notes'>; lang: Lang; altPath?: string }
const { entry, lang, altPath } = Astro.props;
const t = useTranslations(lang);
const { Content } = await render(entry);
const backHref = lang === 'tr' ? '/ders-notlari' : '/en/notes';
---
<Base title={entry.data.title} description={entry.data.description} lang={lang} altPath={altPath}>
  <a href={backHref} class="text-sm text-accent underline">← {t('notes.title')}</a>
  <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
    <span class="px-1.5 py-0.5 rounded bg-accent/10 text-accent dark:bg-accent-light/20 dark:text-gray-200 font-medium">
      {entry.data.category}
    </span>
    <time datetime={entry.data.date.toISOString()}>{formatDate(entry.data.date, lang)}</time>
  </div>
  <h1 class="mt-2 text-3xl font-semibold">{entry.data.title}</h1>
  {entry.data.pdf && (
    <a href={entry.data.pdf} download
      class="inline-block mt-4 px-4 py-2 rounded bg-accent text-white text-sm font-medium hover:bg-accent-light">
      {t('notes.download')}
    </a>
  )}
  <div class="prose-body mt-6">
    <Content />
  </div>
</Base>
```

- [ ] **Step 3: TR liste ve detay sayfalarını yaz**

`src/pages/ders-notlari/index.astro`:
```astro
---
import NotesIndex from '../../components/pages/NotesIndex.astro';
---
<NotesIndex lang="tr" />
```

`src/pages/ders-notlari/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import NoteDetail from '../../components/pages/NoteDetail.astro';
import { byLocale, slugOf } from '../../lib/content';

export async function getStaticPaths() {
  const all = await getCollection('notes', ({ data }) => !data.draft);
  const tr = byLocale(all, 'tr');
  const enSlugs = new Set(byLocale(all, 'en').map(slugOf));
  return tr.map((entry) => {
    const slug = slugOf(entry);
    return {
      params: { slug },
      props: { entry, altPath: enSlugs.has(slug) ? `/en/notes/${slug}` : undefined },
    };
  });
}
const { entry, altPath } = Astro.props;
---
<NoteDetail entry={entry} lang="tr" altPath={altPath} />
```

- [ ] **Step 4: Build ve içerik doğrulaması**

```bash
npm run build \
  && grep -q 'class="katex' dist/ders-notlari/limit-kavrami-ap-calculus/index.html \
  && grep -q '/pdf/notes/limit-kavrami-ap-calculus.pdf' dist/ders-notlari/limit-kavrami-ap-calculus/index.html \
  && grep -q 'data-category="TMUA"' dist/ders-notlari/index.html \
  && echo NOTES_OK
```
Beklenen: `NOTES_OK`. (KaTeX render edilmiş `<span class="katex">` üretir; PDF düğmesi ve kategori attribute'ları HTML'de olmalı.)

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: notes list with category filter and note detail with KaTeX and PDF download"
```

---

### Task 8: Blog (liste + detay) ve Etkinlikler (TR)

**Files:**
- Create: `src/components/pages/BlogIndex.astro`, `src/components/pages/BlogPost.astro`, `src/components/pages/Events.astro`
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/etkinlikler.astro`

**Interfaces:**
- Consumes: `PostCard`/`EventCard`/`Base` (Task 5), `byLocale/slugOf/sortByDateDesc/splitEvents` (Task 3)
- Produces: `BlogIndex.astro` props `{ lang }`; `BlogPost.astro` props `{ entry: CollectionEntry<'blog'>; lang; altPath? }`; `Events.astro` props `{ lang }`

- [ ] **Step 1: BlogIndex.astro yaz** (`src/components/pages/BlogIndex.astro`)

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import PostCard from '../PostCard.astro';
import { byLocale, sortByDateDesc } from '../../lib/content';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const posts = sortByDateDesc(
  byLocale(await getCollection('blog', ({ data }) => !data.draft), lang)
);
---
<Base title={t('blog.title')} description={t('blog.intro')} lang={lang}>
  <h1 class="text-3xl font-semibold">{t('blog.title')}</h1>
  <p class="mt-2 text-gray-600 dark:text-gray-400">{t('blog.intro')}</p>
  <div class="mt-4">
    {posts.length === 0 && <p class="text-gray-500">{t('blog.empty')}</p>}
    {posts.map((entry) => <PostCard entry={entry} lang={lang} />)}
  </div>
</Base>
```

- [ ] **Step 2: BlogPost.astro yaz** (`src/components/pages/BlogPost.astro`)

```astro
---
import { render, type CollectionEntry } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { formatDate } from '../../lib/date';
import { useTranslations, type Lang } from '../../i18n/ui';
import 'katex/dist/katex.min.css';

interface Props { entry: CollectionEntry<'blog'>; lang: Lang; altPath?: string }
const { entry, lang, altPath } = Astro.props;
const t = useTranslations(lang);
const { Content } = await render(entry);
const backHref = lang === 'tr' ? '/blog' : '/en/blog';
---
<Base title={entry.data.title} description={entry.data.description} lang={lang} altPath={altPath}>
  <a href={backHref} class="text-sm text-accent underline">← {t('blog.title')}</a>
  <time class="block mt-4 text-xs text-gray-500 dark:text-gray-400" datetime={entry.data.date.toISOString()}>
    {formatDate(entry.data.date, lang)}
  </time>
  <h1 class="mt-2 text-3xl font-semibold">{entry.data.title}</h1>
  {entry.data.tags.length > 0 && (
    <ul class="mt-2 flex flex-wrap gap-2">
      {entry.data.tags.map((tag) => (
        <li class="px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-700 text-xs">{tag}</li>
      ))}
    </ul>
  )}
  <div class="prose-body mt-6">
    <Content />
  </div>
</Base>
```

- [ ] **Step 3: Events.astro yaz** (`src/components/pages/Events.astro`)

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import EventCard from '../EventCard.astro';
import { byLocale, splitEvents } from '../../lib/content';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const events = byLocale(await getCollection('events', ({ data }) => !data.draft), lang);
const { upcoming, past } = splitEvents(events, new Date());
---
<Base title={t('events.title')} description={t('site.description')} lang={lang}>
  <h1 class="text-3xl font-semibold">{t('events.title')}</h1>
  {upcoming.length === 0 && past.length === 0 && (
    <p class="mt-4 text-gray-500">{t('events.empty')}</p>
  )}
  {upcoming.length > 0 && (
    <section class="mt-6">
      <h2 class="text-xl font-semibold">{t('events.upcoming')}</h2>
      {upcoming.map((entry) => <EventCard entry={entry} lang={lang} />)}
    </section>
  )}
  {past.length > 0 && (
    <section class="mt-8">
      <h2 class="text-xl font-semibold">{t('events.past')}</h2>
      {past.map((entry) => <EventCard entry={entry} lang={lang} />)}
    </section>
  )}
</Base>
```

Not: `new Date()` build anında değerlendirilir — site her push'ta yeniden derlendiği için yaklaşan/geçmiş ayrımı pratikte günceldir. İçerik eklemeden uzun süre geçerse ayrım bayatlayabilir; kabul edilebilir (spec kapsamında).

- [ ] **Step 4: TR sayfalarını yaz**

`src/pages/blog/index.astro`:
```astro
---
import BlogIndex from '../../components/pages/BlogIndex.astro';
---
<BlogIndex lang="tr" />
```

`src/pages/blog/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../components/pages/BlogPost.astro';
import { byLocale, slugOf } from '../../lib/content';

export async function getStaticPaths() {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  const tr = byLocale(all, 'tr');
  const enSlugs = new Set(byLocale(all, 'en').map(slugOf));
  return tr.map((entry) => {
    const slug = slugOf(entry);
    return {
      params: { slug },
      props: { entry, altPath: enSlugs.has(slug) ? `/en/blog/${slug}` : undefined },
    };
  });
}
const { entry, altPath } = Astro.props;
---
<BlogPost entry={entry} lang="tr" altPath={altPath} />
```

`src/pages/etkinlikler.astro`:
```astro
---
import Events from '../components/pages/Events.astro';
---
<Events lang="tr" />
```

- [ ] **Step 5: Build doğrula ve commit**

```bash
npm run build \
  && test -f dist/blog/merhaba/index.html \
  && grep -q 'Yaklaşan Etkinlikler' dist/etkinlikler/index.html \
  && echo BLOG_EVENTS_OK
git add -A && git commit -m "feat: blog list/detail and events pages"
```
Beklenen: `BLOG_EVENTS_OK`. (Örnek etkinlik 2026-09-15 tarihli — build tarihi bundan önceyse "Yaklaşan" başlığı üretilir. 2026-09-15 sonrasında çalıştırılıyorsa grep'i 'Geçmiş Etkinlikler' ile değiştir.)

---

### Task 9: İletişim sayfası ve 404

**Files:**
- Create: `src/components/pages/Contact.astro`, `src/pages/iletisim.astro`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `contact` (Task 4 — `src/config.ts`), `Base` (Task 5), `useTranslations` (Task 2)
- Produces: `Contact.astro` props `{ lang: Lang }`. Koşullu render kuralı: `whatsappNumber`/`calendlyUrl`/`web3formsKey` boş string ise ilgili blok HTML'e hiç yazılmaz.

- [ ] **Step 1: Contact.astro yaz** (`src/components/pages/Contact.astro`)

```astro
---
import Base from '../../layouts/Base.astro';
import { contact } from '../../config';
import { useTranslations, type Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const inputCls =
  'w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-accent';
---
<Base title={t('contact.title')} description={t('contact.intro')} lang={lang}>
  <h1 class="text-3xl font-semibold">{t('contact.title')}</h1>
  <p class="mt-2 text-gray-600 dark:text-gray-400">{t('contact.intro')}</p>

  <div class="mt-6 flex flex-wrap gap-3">
    <a href={`mailto:${contact.email}`}
      class="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-sm font-medium hover:border-accent">
      ✉️ {t('contact.email')}: {contact.email}
    </a>
    {contact.whatsappNumber && (
      <a href={`https://wa.me/${contact.whatsappNumber}`}
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-sm font-medium hover:border-accent">
        💬 {t('contact.whatsapp')}
      </a>
    )}
    {contact.calendlyUrl && (
      <a href={contact.calendlyUrl}
        class="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-sm font-medium hover:border-accent">
        📅 {t('contact.calendly')}
      </a>
    )}
  </div>

  {contact.web3formsKey && (
    <form action="https://api.web3forms.com/submit" method="POST" class="mt-10 max-w-xl space-y-4">
      <input type="hidden" name="access_key" value={contact.web3formsKey} />
      <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" class="hidden" style="display:none" />
      <div>
        <label for="name" class="block text-sm font-medium mb-1">{t('contact.form.name')}</label>
        <input id="name" name="name" type="text" required class={inputCls} />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium mb-1">{t('contact.form.email')}</label>
        <input id="email" name="email" type="email" required class={inputCls} />
      </div>
      <div>
        <label for="subject" class="block text-sm font-medium mb-1">{t('contact.form.subject')}</label>
        <input id="subject" name="subject" type="text" required class={inputCls} />
      </div>
      <div>
        <label for="message" class="block text-sm font-medium mb-1">{t('contact.form.message')}</label>
        <textarea id="message" name="message" rows="5" required class={inputCls}></textarea>
      </div>
      <button type="submit" class="px-5 py-2 rounded bg-accent text-white text-sm font-medium hover:bg-accent-light">
        {t('contact.form.send')}
      </button>
    </form>
  )}
</Base>
```

- [ ] **Step 2: iletisim.astro ve 404.astro yaz**

`src/pages/iletisim.astro`:
```astro
---
import Contact from '../components/pages/Contact.astro';
---
<Contact lang="tr" />
```

`src/pages/404.astro`:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="404" description="Sayfa bulunamadı / Page not found" lang="tr">
  <h1 class="text-3xl font-semibold">404</h1>
  <p class="mt-4">Sayfa bulunamadı. / Page not found.</p>
  <p class="mt-2"><a href="/" class="text-accent underline">Ana sayfaya dön</a> · <a href="/en/" class="text-accent underline">Back to home</a></p>
</Base>
```

- [ ] **Step 3: Koşullu render'ı iki yönde doğrula**

```bash
npm run build \
  && grep -q 'mailto:hakanmulaym@gmail.com' dist/iletisim/index.html \
  && ! grep -q 'wa.me' dist/iletisim/index.html \
  && ! grep -q 'web3forms' dist/iletisim/index.html \
  && echo CONTACT_HIDDEN_OK
```
Beklenen: `CONTACT_HIDDEN_OK` (anahtarlar boşken form/WhatsApp/Calendly HTML'de YOK; e-posta VAR).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: contact page with conditional integrations and 404 page"
```

---

### Task 10: İngilizce sayfalar (EN sarmalayıcılar)

**Files:**
- Create: `src/pages/en/index.astro`, `src/pages/en/about.astro`, `src/pages/en/cv.astro`, `src/pages/en/notes/index.astro`, `src/pages/en/notes/[slug].astro`, `src/pages/en/blog/index.astro`, `src/pages/en/blog/[slug].astro`, `src/pages/en/events.astro`, `src/pages/en/contact.astro`

**Interfaces:**
- Consumes: Task 6-9'daki tüm `components/pages/*` gövdeleri (`lang="en"` ile)

- [ ] **Step 1: Basit EN sarmalayıcıları yaz**

`src/pages/en/index.astro`:
```astro
---
import Home from '../../components/pages/Home.astro';
---
<Home lang="en" />
```

`src/pages/en/about.astro`:
```astro
---
import About from '../../components/pages/About.astro';
---
<About lang="en" />
```

`src/pages/en/cv.astro`:
```astro
---
import Cv from '../../components/pages/Cv.astro';
---
<Cv lang="en" />
```

`src/pages/en/notes/index.astro`:
```astro
---
import NotesIndex from '../../../components/pages/NotesIndex.astro';
---
<NotesIndex lang="en" />
```

`src/pages/en/blog/index.astro`:
```astro
---
import BlogIndex from '../../../components/pages/BlogIndex.astro';
---
<BlogIndex lang="en" />
```

`src/pages/en/events.astro`:
```astro
---
import Events from '../../components/pages/Events.astro';
---
<Events lang="en" />
```

`src/pages/en/contact.astro`:
```astro
---
import Contact from '../../components/pages/Contact.astro';
---
<Contact lang="en" />
```

- [ ] **Step 2: EN detay sayfalarını yaz (slug + karşı dil eşlemesi)**

`src/pages/en/notes/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import NoteDetail from '../../../components/pages/NoteDetail.astro';
import { byLocale, slugOf } from '../../../lib/content';

export async function getStaticPaths() {
  const all = await getCollection('notes', ({ data }) => !data.draft);
  const en = byLocale(all, 'en');
  const trSlugs = new Set(byLocale(all, 'tr').map(slugOf));
  return en.map((entry) => {
    const slug = slugOf(entry);
    return {
      params: { slug },
      props: { entry, altPath: trSlugs.has(slug) ? `/ders-notlari/${slug}` : undefined },
    };
  });
}
const { entry, altPath } = Astro.props;
---
<NoteDetail entry={entry} lang="en" altPath={altPath} />
```

`src/pages/en/blog/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../../components/pages/BlogPost.astro';
import { byLocale, slugOf } from '../../../lib/content';

export async function getStaticPaths() {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  const en = byLocale(all, 'en');
  const trSlugs = new Set(byLocale(all, 'tr').map(slugOf));
  return en.map((entry) => {
    const slug = slugOf(entry);
    return {
      params: { slug },
      props: { entry, altPath: trSlugs.has(slug) ? `/blog/${slug}` : undefined },
    };
  });
}
const { entry, altPath } = Astro.props;
---
<BlogPost entry={entry} lang="en" altPath={altPath} />
```

- [ ] **Step 3: Build ve iki dillilik doğrulaması**

```bash
npm run build \
  && test -f dist/en/index.html \
  && test -f dist/en/about/index.html \
  && test -f dist/en/notes/limits-ap-calculus/index.html \
  && grep -q 'lang="en"' dist/en/index.html \
  && grep -q 'href="/en/about"' dist/hakkimda/index.html \
  && echo EN_OK
```
Beklenen: `EN_OK`. (Son grep: TR Hakkımda sayfasındaki dil düğmesi `/en/about`'a gitmeli.)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: English pages mirroring TR structure"
```

---

### Task 11: robots.txt, toplu build doğrulaması ve tarayıcıda görsel kontrol

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: robots.txt yaz** (`public/robots.txt`)

```
User-agent: *
Allow: /

Sitemap: https://hakanmulayim.com/sitemap-index.xml
```

- [ ] **Step 2: Tüm testler + toplu build assertions**

```bash
npm test && npm run build \
  && test -f dist/sitemap-index.xml \
  && test -f dist/robots.txt \
  && test -f dist/404.html \
  && test -f dist/pdf/notes/limit-kavrami-ap-calculus.pdf \
  && [ "$(grep -o 'hreflang' dist/index.html | wc -l | tr -d ' ')" -eq 3 ] \
  && echo FULL_OK
```
Beklenen: `FULL_OK` (hreflang sayısı tam 3: tr, en, x-default).

- [ ] **Step 3: Tarayıcıda görsel doğrulama**

`.claude/launch.json` oluştur:
```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "site", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 4321 }
  ]
}
```
Sonra `preview_start` ile `site` sunucusunu başlat ve Browser pane'de sırayla kontrol et:
1. `http://localhost:4321/` — ana sayfa: isim, rozetler, son notlar/yazılar görünür
2. Sağ üstteki `EN` düğmesi → `/en/` açılır; `TR` düğmesi geri getirir
3. `/ders-notlari` — kategori düğmesi `TMUA` → yalnızca TMUA kartı kalır; `Tümü` → hepsi döner
4. `/ders-notlari/limit-kavrami-ap-calculus` — formüller render edilmiş (ε–δ, limit); "PDF indir" düğmesi tıklanınca PDF iner
5. `/etkinlikler` — örnek etkinlik "Yaklaşan" altında
6. `/iletisim` — yalnızca e-posta kartı görünür (WhatsApp/Calendly/form YOK)
7. `resize_window` preset `mobile` (375px) → ana sayfa ve notlar sayfasında taşma/kırılma yok
8. Konsolda hata yok (`read_console_messages` onlyErrors)

Sorun görürsen düzelt, adımları tekrarla.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: robots.txt, launch config and full build verification"
```

---

### Task 12: GitHub'a yükleme (Chrome destekli)

**Files:** yok (uzak repo işlemleri)

**Interfaces:**
- Produces: `origin` = `https://github.com/<kullanıcı>/hakanmulayim-web.git` (private), `main` push'lanmış

Not: gh CLI 2.85.0 kurulu ama oturum bozuk ("hakanides" hesabı keyring hatası). Kullanıcının GitHub kullanıcı adının gerçekten `hakanides` olup olmadığını başta sor — farklıysa doğru hesapla giriş yapılır.

- [ ] **Step 1: gh oturumunu tazele (kullanıcı katılımıyla)**

```bash
gh auth login --hostname github.com --git-protocol https --web
```
Bu komut bir cihaz kodu gösterir ve tarayıcı açar. **Kullanıcıya söyle:** GitHub'a kendi şifresiyle giriş yapsın (Claude şifre girmez), gösterilen tek kullanımlık kodu GitHub sayfasına yazsın ve yetkilendirmeyi onaylasın. Doğrula:
```bash
gh auth status
```
Beklenen: `Logged in to github.com account <kullanıcı> ... Active account: true`, hata yok.

- [ ] **Step 2: Private repo oluştur ve push'la**

```bash
gh repo create hakanmulayim-web --private --source=. --remote=origin --push
```
Beklenen: `✓ Created repository <kullanıcı>/hakanmulayim-web` ve push başarılı. Doğrula:
```bash
git remote -v && git log origin/main --oneline | head -3
```

---

### Task 13: Cloudflare Pages kurulumu (Chrome destekli)

**Interfaces:**
- Produces: `hakanmulayim-web.pages.dev` (veya benzeri) adresinde canlı site; her `main` push'unda otomatik deploy

Tüm adımlar kullanıcının tarayıcısında yürür. Claude yönlendirir ve sayfayı okur; **hesap oluşturma, şifre, e-posta doğrulama, OAuth onayı kullanıcıda**.

- [ ] **Step 1: Cloudflare hesabı (kullanıcı)**

Kullanıcıyı `https://dash.cloudflare.com/sign-up` adresine yönlendir. Kullanıcı e-postasıyla (hakanmulaym@gmail.com) ücretsiz hesap açar, e-posta doğrulamasını yapar. Zaten hesabı varsa giriş yapar.

- [ ] **Step 2: Pages projesi oluştur ve GitHub'ı bağla**

Dashboard'da: **Workers & Pages → Create → Pages → Connect to Git**. Kullanıcı "Connect GitHub" ile GitHub OAuth iznini kendisi onaylar (yalnızca `hakanmulayim-web` reposuna erişim izni seçmesi yeterli). Repo listeden seçilir.

- [ ] **Step 3: Build ayarları**

| Alan | Değer |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variables | `NODE_VERSION` = `22` |

"Save and Deploy" → ilk build ~2 dk.

- [ ] **Step 4: pages.dev adresini doğrula**

Build bitince verilen `*.pages.dev` URL'sini tarayıcıda aç: ana sayfa, `/en/`, `/ders-notlari/limit-kavrami-ap-calculus` (KaTeX + PDF), `/iletisim` kontrol edilir. Ayrıca:
```bash
curl -sI https://<proje>.pages.dev | head -1
```
Beklenen: `HTTP/2 200`.

---

### Task 14: Domain bağlama — GoDaddy nameserver → Cloudflare (Chrome destekli)

**Files:**
- Create: `docs/dns-backup-godaddy.md` (mevcut DNS kayıtlarının yedeği)

**Interfaces:**
- Produces: `https://hakanmulayim.com` (kök) canlı; `https://www.hakanmulayim.com` → 301 → kök

- [ ] **Step 1: Mevcut GoDaddy DNS kayıtlarını yedekle**

Kullanıcı GoDaddy'ye giriş yapar (godaddy.com → My Products → hakanmulayim.com → DNS). Claude sayfadaki TÜM kayıtları (tip, ad, değer, TTL) ve mevcut nameserver'ları okuyup `docs/dns-backup-godaddy.md` dosyasına yazar; commit eder:
```bash
git add docs/dns-backup-godaddy.md && git commit -m "docs: backup of original GoDaddy DNS records" && git push
```
Bu yedek, gerekirse nameserver değişikliğini geri almanın güvencesidir.

- [ ] **Step 2: Cloudflare'e site ekle**

Cloudflare dashboard → **Add a site** → `hakanmulayim.com` → **Free** plan. Cloudflare mevcut DNS kayıtlarını tarar; listeyi Step 1'deki yedekle karşılaştır (eksik önemli kayıt varsa elle ekle — özellikle varsa MX/e-posta kayıtları). Devam edince Cloudflare 2 nameserver verir (ör. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`) — bunları not et.

- [ ] **Step 3: GoDaddy'de nameserver değişikliği (kullanıcı)**

GoDaddy DNS sayfası → **Nameservers → Change → Enter my own nameservers**. Kullanıcı Cloudflare'in verdiği 2 nameserver'ı girer ve kaydeder (GoDaddy kimlik doğrulaması isterse kullanıcı tamamlar). Claude alanları tarif eder, kullanıcı yazar/onaylar.

- [ ] **Step 4: Aktivasyonu bekle ve doğrula**

Cloudflare "Active" durumuna geçene kadar bekle (genelde 15 dk – 2 saat; e-posta da gelir). Doğrula:
```bash
dig NS hakanmulayim.com +short
```
Beklenen: iki `*.ns.cloudflare.com` satırı. Aktivasyon gecikirse 30 dk aralıklarla kontrol et; 48 saati aşarsa GoDaddy'deki girişleri yeniden kontrol et.

- [ ] **Step 5: Pages'e özel alan adlarını bağla**

Workers & Pages → proje → **Custom domains → Set up a custom domain**: önce `hakanmulayim.com`, sonra `www.hakanmulayim.com`. Cloudflare gerekli CNAME kayıtlarını otomatik önerir; kullanıcı onaylar. SSL sertifikaları otomatik verilir (~15 dk).

- [ ] **Step 6: www → kök yönlendirmesi**

Cloudflare dashboard → hakanmulayim.com zone → **Rules → Redirect Rules** → "Redirect from WWW to Root" şablonu → uygula (301).

- [ ] **Step 7: Uçtan uca doğrula**

```bash
curl -sI https://hakanmulayim.com | head -1
curl -sI https://www.hakanmulayim.com | grep -iE '^(HTTP|location)'
```
Beklenen: kök `HTTP/2 200`; www `301` + `location: https://hakanmulayim.com/...`. Tarayıcıda da her iki adresi aç, kilit (SSL) simgesini doğrula.

---

### Task 15: Entegrasyonlar — Web3Forms, WhatsApp, Calendly

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 1: Web3Forms anahtarı al (kullanıcı)**

Kullanıcıyı `https://web3forms.com` adresine yönlendir: e-postasını (hakanmulaym@gmail.com) girer → access key e-postasına gelir → kullanıcı anahtarı sohbete yapıştırır. (Bu anahtar HTML'e gömülen public bir anahtardır; gizli değildir.)

- [ ] **Step 2: WhatsApp numarası ve Calendly kararını sor (kullanıcı)**

- WhatsApp: numarayı uluslararası formatta iste (ör. `905321234567`). Vermek istemezse boş bırakılır (düğme çıkmaz).
- Calendly: kullanıcı isterse `https://calendly.com/signup` üzerinden hesap açar (Google ile girişi kendisi yapar), etkinlik tipi oluşturur (ör. "30 dk tanışma"), bağlantıyı sohbete yapıştırır. İstemezse boş kalır.

- [ ] **Step 3: config.ts'i doldur, yayınla**

`src/config.ts` içindeki `whatsappNumber`, `calendlyUrl`, `web3formsKey` alanlarına kullanıcının verdiği değerleri yaz. Sonra:
```bash
npm run build && grep -q 'web3forms' dist/iletisim/index.html && echo FORM_RENDERED
git add src/config.ts && git commit -m "feat: enable contact form, WhatsApp and Calendly integrations" && git push
```
Beklenen: `FORM_RENDERED`; push sonrası Pages otomatik deploy (~2 dk).

- [ ] **Step 4: Canlı form testi**

Deploy bitince `https://hakanmulayim.com/iletisim` aç. Formu doldurmadan önce kullanıcıya haber ver; onayıyla test mesajı gönder (ad: "Test", konu: "Site form testi"). Kullanıcı e-postasına mesajın düştüğünü teyit eder. WhatsApp düğmesinin doğru sohbeti açtığını, Calendly bağlantısının doğru sayfaya gittiğini kullanıcı doğrular.

---

### Task 16: Kabul kriterleri turu (spec §8)

Spec'teki kabul listesini tek tek doğrula ve sonucu kullanıcıya raporla:

- [ ] `https://hakanmulayim.com` ve `https://www.hakanmulayim.com` SSL ile açılıyor (Task 14 Step 7 komutları)
- [ ] Tüm sayfalar TR ve EN'de mevcut; dil düğmesi karşılıklı çalışıyor (tarayıcıda `/hakkimda` ⇄ `/en/about` gidiş-dönüş)
- [ ] Örnek ders notunda KaTeX formülleri doğru görüntüleniyor (canlıda `/ders-notlari/limit-kavrami-ap-calculus`)
- [ ] PDF indirme düğmesi çalışıyor (tıkla, dosya iner)
- [ ] Kategori filtresi çalışıyor (TMUA → tek kart)
- [ ] İletişim formu test mesajı e-postaya ulaştı (Task 15 Step 4)
- [ ] WhatsApp ve e-posta bağlantıları doğru hedefe gidiyor
- [ ] Mobil 375px'te düzen bozulmuyor (Browser pane `resize_window` mobile)
- [ ] İçerik ekle-push et-otomatik yayın akışı çalışıyor: `src/content/blog/tr/` altına kısa bir test yazısı ekle, push'la, ~2 dk sonra canlıda gör; ardından dosyayı silip tekrar push'la
- [ ] Lighthouse/PageSpeed 90+: tarayıcıda `https://pagespeed.web.dev` → `hakanmulayim.com` analiz et; Performance ve SEO ≥ 90 bekle (statik Astro sitesinde tipik olarak 95+)

Tur bittiğinde kullanıcıya özet rapor ver: geçen/kalan maddeler, sonraki adımlar (gerçek CV/fotoğraf/not ekleme akışı).

---

## İçerik Güncelleme Akışı (kurulum sonrası referans)

Yeni içerik = yeni Markdown dosyası + push:
1. Kullanıcı Claude'a söyler ("TMUA için türev notu ekle, şu PDF'i de bağla")
2. Claude `src/content/notes/tr/<slug>.md` oluşturur (frontmatter şeması Task 4'te), varsa PDF'i `public/pdf/notes/` altına koyar
3. `git add && git commit && git push` → Cloudflare Pages ~2 dk'da yayınlar
