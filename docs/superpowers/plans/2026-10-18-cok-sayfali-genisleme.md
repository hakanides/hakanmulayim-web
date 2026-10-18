# Çok Sayfalı Genişleme — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.

**Goal:** Spec `2026-10-18-cok-sayfali-genisleme-design.md`'i uygulamak.
**Architecture:** `Base` ortak Header/Footer alır; iç sayfalar `layouts/Page.astro` ile başlık+main kabuğu kullanır; yeni sayfa içerikleri `src/data/*.ts`'te TR/EN; arşiv sayfaları geri taşınıp `accent`→`ink` dönüştürülür.
**Tech:** Astro 5, Tailwind 4, Vitest.

### Task 1: Rotalar, i18n, profile, Header/Footer/Page kabuğu
- [ ] `routes.ts` tam harita (`/cv,/arastirma,/ogretim,/ders-notlari,/blog,/etkinlikler,/iletisim`), detay → liste; `tests/i18n.test.ts` güncelle.
- [ ] `ui.ts`: `nav.research`, `nav.teaching`, `research.title`, `teaching.title` ekle.
- [ ] `profile.ts`: `whatsappNumber`, `calendlyUrl`, `web3formsKey` ekle; `cvPdfUrl='/cv/hakan-mulayim-cv.pdf'`; `config.ts` sil.
- [ ] `Header.astro` (prop `overlay`), `Footer.astro`, `layouts/Page.astro`; `Base` Header+Footer render eder (`overlayHeader` prop). `LangToggle.astro` sil, `Card.astro` kendi footer'ını bırakır.
- [ ] `global.css`: `.prose-body a` ink altı çizili. Build geçer. Commit.

### Task 2: CV, Araştırma, Öğretim
- [ ] `src/data/cv.ts`, `research.ts`, `teaching.ts` (TR/EN, CV PDF'inden).
- [ ] `components/pages/Cv.astro` (yeniden), `Research.astro`, `Teaching.astro`; sayfalar `cv, arastirma, ogretim, en/cv, en/research, en/teaching`.
- [ ] `public/cv/hakan-mulayim-cv.pdf` kopyala. Build + test. Commit.

### Task 3: Arşiv sayfalarını aç
- [ ] `_archive` → `src/pages` geri taşı (hakkimda/about hariç, silinir); import yollarını düzelt; `_archive` kalkar.
- [ ] `NotesIndex, NoteDetail, NoteCard, BlogIndex, BlogPost, PostCard, Events, EventCard, Contact` → `Page` kabuğu, `accent`→`ink`; Contact `profile` kullanır; emoji kaldır.
- [ ] Tüm örnek md'lere `draft: true`. Build: boş durumlar görünür. Commit.

### Task 4: Doğrulama ve yayın
- [ ] Önizlemede her sayfa TR/EN (masaüstü + 375px). `npm test`. Push.
