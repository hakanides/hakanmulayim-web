# Akademik Kartvizit Sitesi — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut çok sayfalı Astro sitesini, spec'teki (`docs/superpowers/specs/2026-10-18-kartvizit-design.md`) tek sayfalık TR/EN akademik kartvizite indirgemek.

**Architecture:** Tüm metin ve koşullu içerik `src/data/profile.ts`'te; tek sayfa bileşeni `Card.astro` bunu iki dilde render eder; `Base.astro` yalnızca `<head>` + `<body>` kabuğu kalır. Diğer sayfalar `src/pages/_archive/` altına taşınır (Astro `_` ile başlayan dizinleri derlemez), kod ve içerik koleksiyonları repoda kalır.

**Tech Stack:** Astro 5 (statik), Tailwind CSS 4 (`@tailwindcss/vite`), Vitest 4, TypeScript strict.

## Global Constraints

- Diller: TR varsayılan ön eksiz (`/`), EN `/en/` (astro.config `prefixDefaultLocale: false`).
- E-posta: `hakan.mulayim@sabanciuniv.edu`.
- Boş config alanı = ilgili öğe render edilmez (CV düğmesi, portre, hero görseli, profil ikonları).
- Renk: siyah-beyaz; vurgu rengi yok. Serif isim/başlık, sans gövde.
- Metinler spec §5'ten harfi harfine alınır.
- Arşivlenen sayfaların derlenebilir kalması için `src/i18n/ui.ts` anahtarları ve `src/config.ts` **silinmez** (spec'ten bilinçli sapma: arşivi tekrar açmak tek `git mv` olsun).
- Her task sonunda `npm test` ve `npm run build` geçer.

---

### Task 1: `profile.ts` ve testi

**Files:**
- Create: `src/data/profile.ts`
- Test: `tests/profile.test.ts`

**Interfaces:**
- Produces: `profile: Profile`, `visibleProfiles(p: Profile): { key: ProfileKey; url: string }[]`, tipler `Profile`, `ProfileKey`, `LangContent`, `ResearchItem`.

- [ ] **Step 1: Testi yaz**

```ts
// tests/profile.test.ts
import { describe, it, expect } from 'vitest';
import { profile, visibleProfiles, type Profile } from '../src/data/profile';

describe('profile content', () => {
  it('has three bio paragraphs and a tagline in both languages', () => {
    for (const lang of ['tr', 'en'] as const) {
      expect(profile[lang].tagline.length).toBeGreaterThan(10);
      expect(profile[lang].bio).toHaveLength(3);
      expect(profile[lang].research.items).toHaveLength(2);
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
```

- [ ] **Step 2: Çalıştır, başarısız olduğunu gör**

Run: `npx vitest run tests/profile.test.ts`
Expected: FAIL — `Cannot find module '../src/data/profile'`

- [ ] **Step 3: `src/data/profile.ts` yaz**

```ts
export type ProfileKey = 'linkedin' | 'orcid' | 'scholar' | 'github';

export interface ResearchItem {
  kind: string;      // "Çalışma kağıdı" / "Working paper" / "Yüksek lisans tezi" / "M.A. thesis"
  title: string;
  with: string;      // ortak yazar veya danışman satırı
  venue: string;     // dergi / kurum + yıl
  note: string;      // bir cümle özet
}

export interface LangContent {
  tagline: string;
  description: string;   // <meta name="description">
  bio: string[];
  research: { heading: string; items: ResearchItem[] };
  cvLabel: string;
  emailLabel: string;
  scrollHint: string;
}

export interface Profile {
  name: string;
  email: string;
  cvPdfUrl: string;      // ör. '/cv/hakan-mulayim-cv.pdf'; boş = düğme yok
  heroImage: string;     // ör. '/img/hero.jpg'; boş = düz koyu zemin
  portrait: string;      // ör. '/img/portrait.jpg'; boş = bölüm yok
  profiles: Record<ProfileKey, string>;
  tr: LangContent;
  en: LangContent;
}

export const profile: Profile = {
  name: 'hakan mülayim',
  email: 'hakan.mulayim@sabanciuniv.edu',
  cvPdfUrl: '',
  heroImage: '',
  portrait: '',
  profiles: { linkedin: '', orcid: '', scholar: '', github: '' },

  tr: {
    tagline: 'Ekonomi Yüksek Lisans Adayı, Sabancı Üniversitesi · Matematik & Ekonomi Eğitmeni',
    description:
      'Hakan Mülayim — Sabancı Üniversitesi Ekonomi yüksek lisans adayı; mikroekonomi teorisi ve ulaşım ekonomisi üzerine araştırma; AP, IB, SAT, TMUA için Matematik & Ekonomi eğitmeni.',
    bio: [
      "Hakan Mülayim, Sabancı Üniversitesi'nde Ekonomi yüksek lisans öğrencisi ve uluslararası sınavlara hazırlanan öğrencilerle matematik ve ekonomi alanında çalışan bir eğitmendir. Araştırma ilgi alanları mikroekonomi teorisi, oyun teorisi, endüstriyel organizasyon ile eşleşme ve piyasa tasarımı; bunların ulaşım ve kent ekonomisine uygulamalarıdır. Yüksek lisans tezi, Eren İnci danışmanlığında, toplu taşımanın optimal finansmanı üzerinedir. Kevin Hasker ve Eren İnci ile birlikte kaleme aldığı “Financing Transit Through Economic Activity” başlıklı çalışma Transportation Research Part B: Methodological dergisine sunulmuştur.",
      "Lisans derecesini Mimar Sinan Güzel Sanatlar Üniversitesi Matematik Bölümü'nde tamamlamıştır. Lisans yıllarında Khovanov homolojisi üzerine bitirme projesi yürütmüş, Directed Reading Program Turkey kapsamında dört boyutlu topoloji çalışmış ve Galatasaray Üniversitesi'nde okuma seminerlerine katılmıştır. 2017'den bu yana Nesin Matematik Köyü programlarının bir parçasıdır; 2026 yaz programında köyde eğitmen olarak görev yapmıştır.",
      "Sabancı Üniversitesi'nde Oyunlar ve Stratejiler (ECON 201) ile İstatistiksel Modelleme (MATH 306) derslerinde asistanlık yapmıştır. Bunun yanında AP Calculus, AP Mikro/Makroekonomi, IB Matematik (AA/AI), IB Ekonomi, SAT Math ve TMUA sınavlarına hazırlanan öğrencilerle ve Ekonomi Olimpiyatı adaylarıyla çalışmaktadır.",
    ],
    research: {
      heading: 'Araştırma',
      items: [
        {
          kind: 'Çalışma kağıdı',
          title: 'Financing Transit Through Economic Activity',
          with: 'Kevin Hasker ve Eren İnci ile',
          venue: 'Transportation Research Part B: Methodological dergisine sunuldu',
          note: 'Alışveriş yolculuklarına hizmet eden toplu taşımanın bilet ücreti ve satış vergisiyle finanse edildiği bir denge modeli; gelirin biletten vergiye kaydırılmasının refahı artırdığını ve refahı en çoklayan bilet ücretinin sıfır olduğunu gösterir.',
        },
        {
          kind: 'Yüksek lisans tezi',
          title: 'Toplu Taşımanın Optimal Finansmanı',
          with: 'Danışman: Eren İnci',
          venue: 'Sabancı Üniversitesi, 2027 (beklenen)',
          note: '',
        },
      ],
    },
    cvLabel: 'CV (PDF)',
    emailLabel: 'E-posta',
    scrollHint: 'Aşağı kaydır',
  },

  en: {
    tagline: 'M.A. Candidate in Economics, Sabancı University · Mathematics & Economics Educator',
    description:
      'Hakan Mülayim — M.A. candidate in Economics at Sabancı University; research in microeconomic theory and transportation economics; Mathematics & Economics educator for AP, IB, SAT and TMUA.',
    bio: [
      'Hakan Mülayim is an M.A. student in Economics at Sabancı University and an educator working with students preparing for international examinations in mathematics and economics. His research interests lie in microeconomic theory, game theory, industrial organization, and matching and market design, with applications to transportation and urban economics. His master’s thesis, advised by Eren İnci, concerns the optimal financing of public transit. His working paper “Financing Transit Through Economic Activity”, written with Kevin Hasker and Eren İnci, is under submission at Transportation Research Part B: Methodological.',
      'He holds a B.Sc. in Mathematics from Mimar Sinan Fine Arts University. As an undergraduate he completed a graduation project on Khovanov homology, studied four-dimensional topology through the Directed Reading Program Turkey, and attended reading seminars at Galatasaray University. He has been part of the Nesin Mathematics Village programs since 2017 and was an instructor in its 2026 summer program.',
      'At Sabancı University he has served as a teaching assistant for Games and Strategies (ECON 201) and Statistical Modelling (MATH 306). He also teaches students preparing for AP Calculus, AP Micro/Macroeconomics, IB Mathematics (AA/AI), IB Economics, SAT Math and TMUA, and coaches candidates for the Economics Olympiad.',
    ],
    research: {
      heading: 'Research',
      items: [
        {
          kind: 'Working paper',
          title: 'Financing Transit Through Economic Activity',
          with: 'with Kevin Hasker and Eren İnci',
          venue: 'Submitted to Transportation Research Part B: Methodological',
          note: 'An equilibrium model in which transit serving shopping trips is financed by a fare and a sales tax; shifting revenue from the fare to the tax raises welfare, and the welfare-maximizing fare is zero.',
        },
        {
          kind: 'M.A. thesis',
          title: 'Optimal Financing of Public Transit',
          with: 'Advisor: Eren İnci',
          venue: 'Sabancı University, expected 2027',
          note: '',
        },
      ],
    },
    cvLabel: 'CV (PDF)',
    emailLabel: 'Email',
    scrollHint: 'Scroll down',
  },
};

const PROFILE_ORDER: ProfileKey[] = ['linkedin', 'orcid', 'scholar', 'github'];

export function visibleProfiles(p: Profile): { key: ProfileKey; url: string }[] {
  return PROFILE_ORDER.filter((k) => p.profiles[k]).map((k) => ({ key: k, url: p.profiles[k] }));
}
```

- [ ] **Step 4: Testin geçtiğini gör**

Run: `npx vitest run tests/profile.test.ts`
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add src/data/profile.ts tests/profile.test.ts
git commit -m "feat: kartvizit içerik modeli (profile.ts) ve testleri"
```

---

### Task 2: Rotaları tek sayfaya indir

**Files:**
- Modify: `src/i18n/routes.ts`
- Modify: `tests/i18n.test.ts`
- Move: `src/pages/{hakkimda,cv,iletisim,etkinlikler}.astro`, `src/pages/ders-notlari/`, `src/pages/blog/` → `src/pages/_archive/`; `src/pages/en/{about,cv,contact,events}.astro`, `src/pages/en/notes/`, `src/pages/en/blog/` → `src/pages/_archive/en/`

**Interfaces:**
- Produces: `getAlternatePath(path: string): string` — `/`↔`/en/`, diğer her şey ana sayfaya.

- [ ] **Step 1: `tests/i18n.test.ts` içindeki `getAlternatePath` bloğunu değiştir**

```ts
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
```

(`useTranslations` ve `getLangFromUrl` testleri aynen kalır.)

- [ ] **Step 2: Çalıştır, başarısız olduğunu gör**

Run: `npx vitest run tests/i18n.test.ts`
Expected: FAIL — `/hakkimda` için `/en/about` dönüyor.

- [ ] **Step 3: `src/i18n/routes.ts` yeniden yaz**

```ts
/** Tek sayfalık site: yalnızca ana sayfa iki dilde var. */
export const routeMap: Record<string, string> = { '/': '/en/' };

/** Mevcut yolun diğer dildeki karşılığı. Ana sayfa dışındaki her yol diğer dilin ana sayfasına düşer. */
export function getAlternatePath(path: string): string {
  const clean = path.replace(/\/+$/, '') || '/';
  const isEn = clean === '/en' || clean.startsWith('/en/');
  return isEn ? '/' : '/en/';
}
```

- [ ] **Step 4: Sayfaları arşive taşı**

```bash
mkdir -p src/pages/_archive/en
git mv src/pages/hakkimda.astro src/pages/cv.astro src/pages/iletisim.astro src/pages/etkinlikler.astro src/pages/ders-notlari src/pages/blog src/pages/_archive/
git mv src/pages/en/about.astro src/pages/en/cv.astro src/pages/en/contact.astro src/pages/en/events.astro src/pages/en/notes src/pages/en/blog src/pages/_archive/en/
```

Arşivdeki dosyaların `../` import yolları bir seviye kayar; düzelt:

```bash
# _archive/*.astro: '../components' -> '../../components', '../layouts' -> '../../layouts' vb.
sed -i '' -E "s#from '\.\./(components|layouts|i18n|lib|config)#from '../../\1#g" src/pages/_archive/*.astro
# _archive/ders-notlari, _archive/blog: '../../' -> '../../../'
sed -i '' -E "s#from '\.\./\.\./(components|layouts|i18n|lib|config)#from '../../../\1#g" src/pages/_archive/ders-notlari/*.astro src/pages/_archive/blog/*.astro
# _archive/en/*.astro: '../../' -> '../../../'
sed -i '' -E "s#from '\.\./\.\./(components|layouts|i18n|lib|config)#from '../../../\1#g" src/pages/_archive/en/*.astro
# _archive/en/notes, _archive/en/blog: '../../../' -> '../../../../'
sed -i '' -E "s#from '\.\./\.\./\.\./(components|layouts|i18n|lib|config)#from '../../../../\1#g" src/pages/_archive/en/notes/*.astro src/pages/_archive/en/blog/*.astro
```

`src/pages/_archive/README.md` ekle:

```md
Bu dizin Astro tarafından derlenmez (`_` ön eki). Çok sayfalı sürümün sayfaları burada;
bir sayfayı yayına almak için `src/pages/` altına geri taşı ve `src/i18n/routes.ts`'e rotasını ekle.
```

- [ ] **Step 5: Test ve build**

Run: `npx vitest run && npm run build 2>&1 | tail -5 && ls dist`
Expected: testler geçer; `dist/` içinde yalnızca `index.html`, `en/`, `404.html`, `_astro/`, `favicon.svg`, `robots.txt`, `sitemap-*.xml`, `pdf/`. `hakkimda`, `ders-notlari`, `blog` dizinleri **yok**.

- [ ] **Step 6: Commit**

```bash
git add -A src/pages src/i18n/routes.ts tests/i18n.test.ts
git commit -m "refactor: çok sayfalı rotaları arşive taşı, routes'u tek sayfaya indir"
```

---

### Task 3: Stil ve layout kabuğu

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/layouts/Base.astro`
- Create: `src/components/LangToggle.astro`
- Delete: `src/components/Header.astro`, `src/components/Footer.astro`
- Modify: `src/pages/404.astro`

**Interfaces:**
- Produces: `Base` props `{ title, description, lang, altPath? }` (değişmedi); `LangToggle` props `{ lang: Lang; altPath: string }`.

- [ ] **Step 1: `global.css`**

```css
@import "tailwindcss";

@theme {
  --color-ink: #111111;
  --color-paper: #ffffff;
  --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

html { scroll-behavior: smooth; }
body { font-family: var(--font-sans); }
h1, h2, h3 { font-family: var(--font-serif); }
```

- [ ] **Step 2: `LangToggle.astro`**

```astro
---
import type { Lang } from '../i18n/ui';
interface Props { lang: Lang; altPath: string }
const { lang, altPath } = Astro.props;
---
<a
  href={altPath}
  class="absolute top-5 right-5 z-10 px-2.5 py-1 text-xs font-medium tracking-wide border border-white/60 text-white/90 hover:bg-white hover:text-ink transition-colors"
  aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
>
  {lang === 'tr' ? 'EN' : 'TR'}
</a>
```

- [ ] **Step 3: `Base.astro` — Header/Footer ve `<main>` sınırlamasını kaldır**

Frontmatter aynen kalır, yalnızca `Header`/`Footer` import satırları silinir. `<body>`:

```astro
  <body class="min-h-screen bg-paper text-ink dark:bg-ink dark:text-gray-100 antialiased">
    <slot />
  </body>
```

- [ ] **Step 4: `Header.astro` ve `Footer.astro`'yu sil**

```bash
git rm src/components/Header.astro src/components/Footer.astro
```

- [ ] **Step 5: `404.astro` — `text-accent` yerine `underline`; main sarmalayıcı ekle**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="404" description="Sayfa bulunamadı / Page not found" lang="tr">
  <main class="min-h-svh flex flex-col items-center justify-center gap-4 px-5 text-center">
    <h1 class="text-5xl">404</h1>
    <p>Sayfa bulunamadı. / Page not found.</p>
    <p><a href="/" class="underline">Ana sayfaya dön</a> · <a href="/en/" class="underline">Back to home</a></p>
  </main>
</Base>
```

- [ ] **Step 6: Build (Card henüz yok; Home.astro eski Header'sız derlenir, hata olmamalı)**

Run: `npm run build 2>&1 | tail -3`
Expected: `[build] Complete!`

- [ ] **Step 7: Commit**

```bash
git add -A src/styles src/layouts src/components src/pages/404.astro
git commit -m "style: siyah-beyaz tema, layout kabuğu ve dil düğmesi"
```

---

### Task 4: `Card.astro` tek sayfa bileşeni

**Files:**
- Create: `src/components/pages/Card.astro`
- Create: `src/components/ProfileIcon.astro`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`
- Delete: `src/components/pages/Home.astro`

**Interfaces:**
- Consumes: `profile`, `visibleProfiles` (Task 1); `Base`, `LangToggle` (Task 3).
- Produces: `Card` props `{ lang: Lang }`.

- [ ] **Step 1: `ProfileIcon.astro` (satır içi SVG, 4 ikon)**

```astro
---
import type { ProfileKey } from '../data/profile';
interface Props { name: ProfileKey }
const { name } = Astro.props;
const labels: Record<ProfileKey, string> = { linkedin: 'LinkedIn', orcid: 'ORCID', scholar: 'Google Scholar', github: 'GitHub' };
---
<span class="sr-only">{labels[name]}</span>
{name === 'linkedin' && (
  <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
)}
{name === 'orcid' && (
  <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM7.37 17.63H5.93V7.4h1.44v10.23zM6.65 6.1a.94.94 0 1 1 0-1.88.94.94 0 0 1 0 1.88zm3.3 1.3h3.9c3.71 0 5.34 2.65 5.34 5.12 0 2.63-2.05 5.11-5.32 5.11H9.95V7.4zm1.44 1.3v7.63h2.4c3.26 0 4-2.48 4-3.81 0-2.07-1.32-3.82-4.08-3.82h-2.32z"/></svg>
)}
{name === 'scholar' && (
  <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true"><path d="M12 2 1 9l11 7 9-5.73V18h2V9L12 2zm0 16.5-7-4.45v3.95c0 1.1 3.13 3 7 3s7-1.9 7-3v-3.95L12 18.5z"/></svg>
)}
{name === 'github' && (
  <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>
)}
```

- [ ] **Step 2: `Card.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import LangToggle from '../LangToggle.astro';
import ProfileIcon from '../ProfileIcon.astro';
import { profile, visibleProfiles } from '../../data/profile';
import { getAlternatePath } from '../../i18n/routes';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const c = profile[lang];
const altPath = getAlternatePath(Astro.url.pathname);
const links = visibleProfiles(profile);
const year = new Date().getFullYear();
const heroStyle = profile.heroImage ? `background-image:url('${profile.heroImage}')` : undefined;
---
<Base title="Hakan Mülayim" description={c.description} lang={lang} altPath={altPath}>
  <header class="relative min-h-svh flex flex-col items-center justify-center text-center bg-ink bg-cover bg-center text-white px-5" style={heroStyle}>
    {profile.heroImage && <div class="absolute inset-0 bg-black/55" aria-hidden="true"></div>}
    <LangToggle lang={lang} altPath={altPath} />
    <div class="relative">
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight">{profile.name}</h1>
      <p class="mt-5 text-sm sm:text-base text-white/80 max-w-xl mx-auto">{c.tagline}</p>
    </div>
    <a href="#bio" class="absolute bottom-8 text-white/60 hover:text-white" aria-label={c.scrollHint}>
      <svg viewBox="0 0 24 24" class="size-7" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </a>
  </header>

  <main class="max-w-2xl mx-auto px-5">
    <section id="bio" class="py-16 sm:py-20 space-y-6 text-[1.05rem] leading-[1.8] text-justify">
      {c.bio.map((p) => <p>{p}</p>)}
    </section>

    <section class="pb-16 sm:pb-20">
      <h2 class="text-2xl mb-6">{c.research.heading}</h2>
      <ul class="space-y-6">
        {c.research.items.map((r) => (
          <li>
            <p class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{r.kind}</p>
            <p class="mt-1 font-serif text-lg">{r.title}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{r.with} · {r.venue}</p>
            {r.note && <p class="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{r.note}</p>}
          </li>
        ))}
      </ul>
      {profile.cvPdfUrl && (
        <a href={profile.cvPdfUrl} class="inline-block mt-8 px-4 py-2 border border-ink dark:border-gray-100 text-sm font-medium hover:bg-ink hover:text-white dark:hover:bg-gray-100 dark:hover:text-ink transition-colors">
          {c.cvLabel}
        </a>
      )}
    </section>

    {profile.portrait && (
      <section class="pb-16 sm:pb-20 flex justify-center">
        <img src={profile.portrait} alt="Hakan Mülayim" class="max-w-xs w-full grayscale" loading="lazy" />
      </section>
    )}
  </main>

  <footer class="border-t border-gray-200 dark:border-gray-800">
    <div class="max-w-2xl mx-auto px-5 py-8 flex flex-col items-center gap-4 text-sm">
      <a href={`mailto:${profile.email}`} class="underline underline-offset-4">{profile.email}</a>
      {links.length > 0 && (
        <ul class="flex gap-5">
          {links.map((l) => (
            <li><a href={l.url} class="text-gray-600 hover:text-ink dark:text-gray-400 dark:hover:text-white" rel="me noopener" target="_blank"><ProfileIcon name={l.key} /></a></li>
          ))}
        </ul>
      )}
      <span class="text-gray-500 dark:text-gray-400">© {year} Hakan Mülayim</span>
    </div>
  </footer>
</Base>
```

- [ ] **Step 3: `index.astro` ve `en/index.astro`**

```astro
---
import Card from '../components/pages/Card.astro';
---
<Card lang="tr" />
```

```astro
---
import Card from '../../components/pages/Card.astro';
---
<Card lang="en" />
```

- [ ] **Step 4: `Home.astro`'yu sil**

```bash
git rm src/components/pages/Home.astro
```

- [ ] **Step 5: Test + build + içerik kontrolü**

Run: `npx vitest run && npm run build 2>&1 | tail -3 && grep -c 'mailto:hakan.mulayim@sabanciuniv.edu' dist/index.html dist/en/index.html && grep -o 'href="/en/"' dist/index.html | head -1 && grep -o 'hreflang="en" href="[^"]*"' dist/index.html`
Expected: testler geçer; her iki dosyada `mailto` 1; TR sayfasında `/en/` düğmesi; hreflang `https://hakanmulayim.com/en/`.

- [ ] **Step 6: Önizleme (masaüstü + 375px)**

Run: `npx astro preview --port 4321` (arka planda), tarayıcıda `/` ve `/en/` ekran görüntüsü; 375px'te yatay kaydırma olmamalı (`document.documentElement.scrollWidth <= 375`).

- [ ] **Step 7: Commit**

```bash
git add -A src/components src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: tek sayfalık akademik kartvizit (Card.astro)"
```

---

### Task 5: Temizlik ve dokümantasyon

**Files:**
- Modify: `docs/superpowers/specs/2026-07-17-hakanmulayim-com-design.md` (başına "Yerini aldı" notu)
- Delete: `.claude/worktrees/` (eski, izlenmeyen worktree kalıntısı)

- [ ] **Step 1: Eski spec'in başına not**

```md
> **Not (2026-10-18):** Bu tasarım yayına alınmadan `2026-10-18-kartvizit-design.md` ile değiştirildi. Sayfalar `src/pages/_archive/` altında duruyor.
```

- [ ] **Step 2: Eski worktree'yi temizle**

```bash
git worktree prune; rm -rf .claude/worktrees; git branch -D worktree-hakanmulayim-site-build 2>/dev/null; git status --short
```

Expected: `git status` temiz (yalnızca spec değişikliği).

- [ ] **Step 3: Commit ve push**

```bash
git add docs/superpowers/specs/2026-07-17-hakanmulayim-com-design.md
git commit -m "docs: eski çok sayfalı spec'e yerini alan doküman notu"
git push origin main
```

---

## Self-Review

- **Spec kapsamı:** §3 bölümler → Task 4; §4 teknik maddeler → Task 1–4 (ui.ts/config.ts silinmemesi Global Constraints'te gerekçeli sapma); §5 içerik → Task 1 harfi harfine; §6 yayınlama bu planın dışında (hosting ayrı adım, kullanıcıyla birlikte); §7 kabul kriterleri → Task 2 Step 5, Task 4 Step 5–6.
- **Placeholder:** yok.
- **Tip tutarlılığı:** `Profile`, `ProfileKey`, `visibleProfiles` Task 1'de tanımlı, Task 4'te aynı adlarla kullanılıyor; `LangToggle` props Task 3 ↔ Task 4 uyumlu; `Base` `altPath` prop'u mevcut.
