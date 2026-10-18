# hakanmulayim.com — Akademik Kartvizit Sitesi Tasarımı (Spec)

**Tarih:** 2026-10-18
**Durum:** Kullanıcı ile birlikte oluşturuldu; onay bekliyor
**Önceki spec:** `2026-07-17-hakanmulayim-com-design.md` (çok sayfalı site). Bu doküman onun
yerine geçer; çok sayfalı yapı kodda kalır ama yayından çıkar.
**Referans:** gokhanmulayim.net/about (kardeşinin sitesi): tam ekran siyah-beyaz fotoğraf,
küçük harfle isim + tek satır ünvan, uzun akademik biyografi, portre, profil ikonları.

## 1. Amaç ve Ziyaretçi

Şimdilik tek sayfalık **akademik kartvizit**. Site ileride genişletilecek; çok sayfalı
altyapı (notlar, blog, etkinlikler, CV sayfası) repoda kapalı tutulur.

Ziyaretçi öncelik sırası ve her birinin aradığı:

| Ziyaretçi | Aradığı | Sayfada karşılığı |
|---|---|---|
| Doktora komiteleri, potansiyel danışmanlar | Araştırma ciddiyeti, CV | Research bölümü, CV PDF düğmesi, kurumsal e-posta |
| Öğrenci ve veliler | Hangi sınavlar, nasıl ulaşırım | Biyografi 3. paragraf, e-posta |
| Editör / konferans düzenleyicileri | Kim, nerede | Ünvan satırı, 1. paragraf, profil bağlantıları |
| Matematik camiası (Nesin Köyü, DRP, Galatasaray) | Ne yapıyor | Biyografi 2. paragraf |
| Google'da arayan herkes | Güvenilir, güncel kaynak | Tüm sayfa; SEO meta ve hreflang |

## 2. Kararlar

| Karar | Seçim |
|---|---|
| Kapsam | Tek sayfa: `/` (TR) ve `/en/` (EN). Başka sayfa yok (404 hariç). |
| Diller | TR varsayılan, EN `/en/`; sağ üstte TR/EN düğmesi. Menü yok. |
| Görsel dil | Siyah-beyaz, süssüz. Hero koyu zemin; gövde açık zemin, siyah metin. Sistem karanlık modunda gövde de koyu. Serif isim/başlıklar, sans gövde, geniş satır aralığı. Tek vurgu rengi yok. |
| Fotoğraf | Henüz yok. Hero düz koyu zeminle başlar; portre bölümü fotoğraf verilene kadar gösterilmez. Fotoğraf gelince `public/img/` altına konur ve config'de yol verilir. |
| E-posta | `hakan.mulayim@sabanciuniv.edu` |
| Profil bağlantıları | Config'de boş = gösterilmez. Kullanıcı adresleri verince LinkedIn / ORCID / Google Scholar / GitHub eklenir. |
| CV PDF | `public/cv/hakan-mulayim-cv.pdf` konunca config'de yol verilir; boşken düğme gösterilmez. |
| İçerik yeri | `src/data/profile.ts` içinde TR/EN metinler; Markdown koleksiyonu değil (tek sayfa için yeterli, derleme zamanında tip güvenli). |
| Kaldırılan | Web3Forms formu, WhatsApp, Calendly, rozetler, kart bileşenleri (kodda kalır, sayfada yok). |
| Hosting | Değişmedi: GitHub (`hakanides/hakanmulayim-web`, private) → Cloudflare Pages; GoDaddy'de nameserver Cloudflare'e. |

## 3. Sayfa Yapısı (yukarıdan aşağıya)

1. **Hero** — ekran yüksekliğinde (`min-h-svh`) koyu zemin (`#111`). Ortada küçük harf
   serif "hakan mülayim" (büyük punto), altında tek satır ünvan (sans, açık gri).
   Sağ üstte TR/EN düğmesi (sadece bu). Altta aşağı ok (scroll ipucu), dekoratif.
   Fotoğraf verilirse arka plan görseli + koyu kaplama (`bg-black/50`), metin aynı.
2. **Biyografi** — `max-w-2xl`, üç paragraf; metin §5'te.
3. **Research** — başlık "Araştırma / Research". İki madde:
   - Çalışma kağıdı: *Financing Transit Through Economic Activity* (Kevin Hasker ve
     Eren İnci ile), *Transportation Research Part B: Methodological* dergisine sunuldu.
     Bir cümle özet.
   - Yüksek lisans tezi: *Optimal Financing of Public Transit* (danışman: Eren İnci),
     Sabancı Üniversitesi, 2027 (beklenen).
   Altında **CV (PDF)** düğmesi — config'de yol varsa.
4. **Portre** — ortalanmış, `max-w-xs`, config'de görsel varsa.
5. **İletişim bandı** (footer) — e-posta bağlantısı; varsa profil ikonları (SVG satır içi);
   `© {yıl} Hakan Mülayim`.

Mobil (375px): hero metni ortalı ve sarmalı; biyografi tek sütun; ikonlar sırada.

## 4. Teknik Tasarım

Mevcut Astro 5 + Tailwind 4 projesi korunur. Değişiklikler:

- **`src/data/profile.ts`** (yeni): `profile = { email, cvPdfUrl, heroImage, portrait,
  profiles: { linkedin, orcid, scholar, github }, tr: { tagline, bio: string[],
  research: { heading, items: [{ kind, title, with, venue, note }] } }, en: {...} }`.
  Boş string = ilgili öğe gösterilmez. `src/config.ts` kaldırılır (kullanımı kalmaz).
- **`src/components/pages/Card.astro`** (yeni): tek sayfa bileşeni; `lang` prop'u alır,
  bölümleri `profile`'dan üretir. `src/pages/index.astro` ve `src/pages/en/index.astro`
  bunu çağırır. `Home.astro` silinir.
- **`src/layouts/Base.astro`**: Header/Footer çağrıları kalkar; `<main>` sınırlamaları
  kalkar (hero tam genişlik ister). SEO/hreflang mantığı aynen kalır.
- **`src/components/LangToggle.astro`** (yeni): hero üstüne mutlak konumlu TR/EN.
  `Header.astro` ve `Footer.astro` silinir; iletişim bandı `Card.astro` içinde.
- **`src/i18n/routes.ts`**: `routeMap` yalnızca `'/': '/en/'`; bilinmeyen yollar
  ana sayfaya düşer. `ui.ts`: kullanılmayan anahtarlar silinir; kalanlar `site.title`,
  `site.description`, `card.research`, `card.cv`, `card.email`, `notFound.*`.
- **Yayından çıkarma:** `src/pages/{hakkimda,cv,iletisim,etkinlikler}.astro`,
  `src/pages/{ders-notlari,blog}/`, `src/pages/en/{about,cv,contact,events}.astro`,
  `src/pages/en/{notes,blog}/` → `src/pages/_archive/` altına taşınır (Astro `_` ile
  başlayan dizinleri derlemez). İçerik koleksiyonları, `content.config.ts`, kart
  bileşenleri ve `lib/` olduğu gibi kalır; derleme hatası vermez.
- **Stil:** `global.css`'te `--color-accent` kaldırılır; `--color-ink: #111`,
  `--color-paper: #fff`. Serif/sans yığınları aynı.
- **`public/robots.txt`, sitemap:** değişmez; sitemap artık iki URL üretir.
- **`astro.config.mjs`:** değişmez.

### Hata yönetimi
Statik site; çalışma zamanı hatası yok. Derleme zamanı: `profile.ts` tipli; eksik dil
alanı TypeScript hatası verir. Boş config alanları koşullu render ile gizlenir.

### Test
- `tests/i18n.test.ts`: `getAlternatePath` yeni haritaya göre güncellenir
  (`/`↔`/en/`, bilinmeyen → ana sayfa).
- `tests/profile.test.ts` (yeni): `visibleProfiles(profile)` boş adresleri eler;
  her iki dilde `bio` üç paragraf ve `tagline` dolu.
- `tests/lib.test.ts`: dokunulmaz (lib kalıyor).
- Derleme: `npm run build` iki sayfa + 404 üretmeli; `dist/` içinde `hakkimda`,
  `ders-notlari` vb. dizinler **olmamalı**.
- Görsel: 375px ve masaüstünde önizleme ekran görüntüsü.

## 5. İçerik

### Ünvan satırı
- TR: `Ekonomi Yüksek Lisans Adayı, Sabancı Üniversitesi · Matematik & Ekonomi Eğitmeni`
- EN: `M.A. Candidate in Economics, Sabancı University · Mathematics & Economics Educator`

### Biyografi (TR)
1. Hakan Mülayim, Sabancı Üniversitesi'nde Ekonomi yüksek lisans öğrencisi ve uluslararası
   sınavlara hazırlanan öğrencilerle matematik ve ekonomi alanında çalışan bir eğitmendir.
   Araştırma ilgi alanları mikroekonomi teorisi, oyun teorisi, endüstriyel organizasyon ile
   eşleşme ve piyasa tasarımı; bunların ulaşım ve kent ekonomisine uygulamalarıdır. Yüksek
   lisans tezi, Eren İnci danışmanlığında, toplu taşımanın optimal finansmanı üzerinedir.
   Kevin Hasker ve Eren İnci ile birlikte kaleme aldığı "Financing Transit Through Economic
   Activity" başlıklı çalışma *Transportation Research Part B: Methodological* dergisine
   sunulmuştur.
2. Lisans derecesini Mimar Sinan Güzel Sanatlar Üniversitesi Matematik Bölümü'nde
   tamamlamıştır. Lisans yıllarında Khovanov homolojisi üzerine bitirme projesi yürütmüş,
   Directed Reading Program Turkey kapsamında dört boyutlu topoloji çalışmış ve Galatasaray
   Üniversitesi'nde okuma seminerlerine katılmıştır. 2017'den bu yana Nesin Matematik Köyü
   programlarının bir parçasıdır; 2026 yaz programında köyde eğitmen olarak görev yapmıştır.
3. Sabancı Üniversitesi'nde Oyunlar ve Stratejiler (ECON 201) ile İstatistiksel Modelleme
   (MATH 306) derslerinde asistanlık yapmıştır. Bunun yanında AP Calculus, AP
   Mikro/Makroekonomi, IB Matematik (AA/AI), IB Ekonomi, SAT Math ve TMUA sınavlarına
   hazırlanan öğrencilerle ve Ekonomi Olimpiyatı adaylarıyla çalışmaktadır.

### Biography (EN)
1. Hakan Mülayim is an M.A. student in Economics at Sabancı University and an educator
   working with students preparing for international examinations in mathematics and
   economics. His research interests lie in microeconomic theory, game theory, industrial
   organization, and matching and market design, with applications to transportation and
   urban economics. His master's thesis, advised by Eren İnci, concerns the optimal
   financing of public transit. His working paper "Financing Transit Through Economic
   Activity", written with Kevin Hasker and Eren İnci, is under submission at
   *Transportation Research Part B: Methodological*.
2. He holds a B.Sc. in Mathematics from Mimar Sinan Fine Arts University. As an
   undergraduate he completed a graduation project on Khovanov homology, studied
   four-dimensional topology through the Directed Reading Program Turkey, and attended
   reading seminars at Galatasaray University. He has been part of the Nesin Mathematics
   Village programs since 2017 and was an instructor in its 2026 summer program.
3. At Sabancı University he has served as a teaching assistant for Games and Strategies
   (ECON 201) and Statistical Modelling (MATH 306). He also teaches students preparing for
   AP Calculus, AP Micro/Macroeconomics, IB Mathematics (AA/AI), IB Economics, SAT Math and
   TMUA, and coaches candidates for the Economics Olympiad.

### Research maddeleri
- **Working paper:** "Financing Transit Through Economic Activity" (with Kevin Hasker and
  Eren İnci). Submitted to *Transportation Research Part B: Methodological*.
  TR özet: Alışveriş yolculuklarına hizmet eden toplu taşımanın bilet ücreti ve satış
  vergisiyle finanse edildiği bir denge modeli; gelirin biletten vergiye kaydırılmasının
  refahı artırdığını ve refahı en çoklayan bilet ücretinin sıfır olduğunu gösterir.
  EN: An equilibrium model in which transit serving shopping trips is financed by a fare
  and a sales tax; shifting revenue from the fare to the tax raises welfare, and the
  welfare-maximizing fare is zero.
- **M.A. thesis:** "Optimal Financing of Public Transit" (advisor: Eren İnci), Sabancı
  University, expected 2027. TR: "Toplu Taşımanın Optimal Finansmanı" (danışman: Eren İnci),
  Sabancı Üniversitesi, 2027 (beklenen).

### Meta açıklama
- TR: "Hakan Mülayim — Sabancı Üniversitesi Ekonomi yüksek lisans adayı; mikroekonomi
  teorisi ve ulaşım ekonomisi üzerine araştırma; AP, IB, SAT, TMUA için Matematik & Ekonomi
  eğitmeni."
- EN: "Hakan Mülayim — M.A. candidate in Economics at Sabancı University; research in
  microeconomic theory and transportation economics; Mathematics & Economics educator for
  AP, IB, SAT and TMUA."

## 6. Yayınlama (değişmedi, özet)

1. Değişiklikler `main`'e commit + push.
2. Cloudflare Pages: hesap (kullanıcı), depo bağlama, build `npm run build`, çıktı `dist`.
   İlk yayın `*.pages.dev`.
3. Cloudflare'de zone ekleme; GoDaddy'de mevcut DNS kayıtları not edilip nameserver'lar
   Cloudflare'e çevrilir (kullanıcı). `hakanmulayim.com` + `www` Pages'e bağlanır,
   `www` → kök yönlendirmesi, SSL otomatik.
4. Doğrulama: her iki adres HTTPS ile açılır, TR/EN geçişi çalışır, 375px'te düzen bozulmaz.

## 7. Kabul Kriterleri

- [ ] `npm run build` yalnızca `/`, `/en/`, `/404` üretir
- [ ] Testler geçer
- [ ] Hero'da isim + ünvan, sağ üstte TR/EN; düğme iki yönde çalışır
- [ ] Biyografi üç paragraf, Research iki madde, her iki dilde
- [ ] E-posta bağlantısı `mailto:hakan.mulayim@sabanciuniv.edu`
- [ ] Config boşken CV düğmesi, portre ve profil ikonları görünmez
- [ ] 375px'te yatay kaydırma yok
- [ ] `hakanmulayim.com` ve `www` SSL ile yayında

## 8. Kapsam Dışı (şimdilik)

Notlar, blog, etkinlikler, CV sayfası, iletişim formu, WhatsApp/Calendly, analitik,
fotoğraflar ve profil bağlantıları (içerik gelince tek config değişikliği).
