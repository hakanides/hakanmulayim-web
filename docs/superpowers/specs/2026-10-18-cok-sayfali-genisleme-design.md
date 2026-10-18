# hakanmulayim.com — Çok Sayfalı Genişleme (Spec)

**Tarih:** 2026-10-18 · **Durum:** Kullanıcı onaylı · **Önceki:** `2026-10-18-kartvizit-design.md` (ana sayfa aynen kalır)

## Kapsam
Kartvizit ana sayfasının üstüne 7 iç sayfa eklenir; menü her sayfada görünür.

| Sayfa | TR | EN | Kaynak |
|---|---|---|---|
| Ana sayfa | `/` | `/en/` | mevcut Card |
| CV | `/cv` | `/en/cv` | yeni, `src/data/cv.ts` (CV PDF'inden) |
| Araştırma | `/arastirma` | `/en/research` | yeni, `src/data/research.ts`; "Matematik geçmişi" alt bölümü |
| Öğretim | `/ogretim` | `/en/teaching` | yeni, `src/data/teaching.ts` |
| Ders Notları (+detay) | `/ders-notlari` | `/en/notes` | arşivden, tema uyarlanır |
| Blog (+detay) | `/blog` | `/en/blog` | arşivden |
| Etkinlikler | `/etkinlikler` | `/en/events` | arşivden |
| İletişim | `/iletisim` | `/en/contact` | arşivden; e-posta `profile.email`; WhatsApp/Calendly/form `profile`'da boş → gizli |

Hakkımda sayfası eklenmez (ana sayfa bu işi görür); arşivdeki `hakkimda`/`about` silinir.

## Kararlar
- **Menü:** Ana Sayfa · CV · Araştırma · Öğretim · Ders Notları · Blog · Etkinlikler · İletişim · TR/EN. Ana sayfada hero üstüne şeffaf (beyaz metin), iç sayfalarda üstte ince çizgili bar. Mobilde satır sarar (hamburger yok).
- **Tema:** siyah-beyaz korunur; arşiv bileşenlerindeki `accent` sınıfları `ink`/altı çizili ile değiştirilir.
- **Footer:** e-posta + profil ikonları + ©; `Base` içinde ortak.
- **Örnek içerikler:** tüm örnek not/yazı/etkinlik `draft: true`; canlıda boş durum mesajı görünür.
- **CV PDF:** `public/cv/hakan-mulayim-cv.pdf` (telefon numarası dahil, kullanıcı onayı var); ana sayfa ve CV sayfasında düğme.
- **İçerik dosyaları:** `src/config.ts` silinir; iletişim ayarları `profile.ts`'e taşınır.
- **Rotalar:** `routeMap` tam liste; detay sayfaları diğer dilin listesine düşer (eski davranış).

## Kabul
- `npm run build` TR+EN 8'er sayfa + 404 üretir; testler geçer.
- Her sayfada menü ve TR/EN karşılıklı çalışır; 375px'te yatay kaydırma yok.
- Notlar/Blog/Etkinlikler canlıda boş durum gösterir; CV PDF indirilebilir.
