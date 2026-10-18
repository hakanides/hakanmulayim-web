> **Not (2026-10-18):** Bu tasarım yayına alınmadan `2026-10-18-kartvizit-design.md` ile değiştirildi. Sayfalar `src/pages/_archive/` altında duruyor.

# hakanmulayim.com — Kişisel Site Tasarım Dokümanı (Spec)

**Tarih:** 2026-07-17
**Durum:** Kullanıcı onaylı tasarım — uygulama planı bu dokümandan üretilecek (OPUS modeli ile yürütülecek)
**Domain:** hakanmulayim.com (GoDaddy'den alındı; domain GoDaddy'de kalacak)

## 1. Amaç ve Hedef Kitle

Hakan Mülayim'in kişisel sitesi. Sahibi hem akademik kariyer yürütüyor hem de
uluslararası sınavlar (AP, IB, SAT, TMUA vb.) için Matematik & Ekonomi eğitmenliği
ve Ekonomi Olimpiyatı eğitmenliği yapıyor.

Site şunları sağlayacak:

1. **Vitrin:** Kim olduğu, akademik geçmişi, eğitmenlik deneyimi (Hakkımda + CV)
2. **Kaynak merkezi:** Çeşitli alanlarda ders notları (web sayfası + indirilebilir PDF)
3. **Yayın:** Blog yazıları
4. **Duyuru:** Etkinlik duyuruları (yaklaşan/geçmiş)
5. **Dönüşüm:** Öğrenci/velilerin kolayca iletişime geçmesi (form, e-posta, WhatsApp, Calendly)

Hedef kitle: uluslararası sınavlara hazırlanan öğrenciler ve velileri (TR + uluslararası),
akademik çevre.

## 2. Onaylanan Temel Kararlar

| Karar | Seçim |
|---|---|
| Framework | Astro 5 (statik çıktı) |
| Stil | Tailwind CSS |
| Hosting | Cloudflare Pages (ücretsiz plan, ticari kullanıma izinli) |
| Kod deposu | GitHub (kullanıcının mevcut hesabı; az kullanıyor, yönlendirme gerekir) |
| DNS | GoDaddy'de nameserver'lar Cloudflare'e yönlendirilecek (domain GoDaddy'de kalır) |
| Diller | Türkçe (varsayılan, ön eksiz) + İngilizce (`/en/` ön ekli) |
| Matematik | KaTeX (remark-math + rehype-katex) |
| İletişim formu | Web3Forms (ücretsiz, sunucusuz, honeypot spam koruması) |
| Randevu | Calendly bağlantısı (hesap kurulumdan sonra eklenecek) |
| İçerik yönetimi | Markdown dosyaları, Claude ile düzenleme, git push → otomatik yayın |
| Tasarım dili | Sade & akademik: temiz tipografi, bol beyaz alan, tek vurgu rengi, mobil uyumlu |
| Başlangıç içeriği | Placeholder (CV, fotoğraf, gerçek notlar henüz hazır değil; sonradan eklenecek) |

## 3. Site Haritası ve URL Yapısı

Türkçe varsayılan dildir ve URL ön eki almaz; İngilizce `/en/` ön eki alır.
Her sayfanın başlığında (header) TR/EN geçiş düğmesi bulunur ve sayfanın diğer
dildeki karşılığına götürür.

| Sayfa | TR URL | EN URL |
|---|---|---|
| Ana sayfa | `/` | `/en/` |
| Hakkımda | `/hakkimda` | `/en/about` |
| CV | `/cv` | `/en/cv` |
| Ders Notları (liste) | `/ders-notlari` | `/en/notes` |
| Ders Notu (detay) | `/ders-notlari/<slug>` | `/en/notes/<slug>` |
| Blog (liste) | `/blog` | `/en/blog` |
| Blog yazısı (detay) | `/blog/<slug>` | `/en/blog/<slug>` |
| Etkinlikler | `/etkinlikler` | `/en/events` |
| İletişim | `/iletisim` | `/en/contact` |

### Sayfa içerikleri

- **Ana sayfa:** İsim + ünvan (akademisyen & Matematik-Ekonomi eğitmeni), kısa tanıtım,
  uzmanlık rozetleri (AP, IB, SAT, TMUA, Ekonomi Olimpiyatı), son 3 not + son 3 yazı,
  iletişim çağrısı (CTA).
- **Hakkımda:** Akademik geçmiş, eğitmenlik deneyimi, uzmanlık alanları, profil fotoğrafı alanı.
- **CV:** Eğitim, deneyim, yayınlar bölümü; PDF CV indirme düğmesi (`/cv/hakan-mulayim-cv.pdf` hazır olunca).
- **Ders Notları:** Kategori filtresi (AP, IB, SAT, TMUA, Olimpiyat, Matematik, Ekonomi).
  Not detayında: web içeriği (KaTeX formüller) + varsa "PDF indir" düğmesi.
- **Blog:** Tarih sırasıyla yazı listesi, kategori etiketleri.
- **Etkinlikler:** Yaklaşan / geçmiş ayrımı; tarih, yer, açıklama, varsa kayıt bağlantısı.
- **İletişim:** Web3Forms formu (ad, e-posta, konu, mesaj), e-posta linki
  (hakanmulaym@gmail.com), WhatsApp düğmesi ve Calendly bağlantısı.
  WhatsApp numarası, Calendly adresi ve Web3Forms anahtarı Aşama 5'te kullanıcıdan
  alınır; her biri hazır olana kadar ilgili düğme sitede gösterilmez (koşullu render).
  Bu üçü hazır değilken iletişim sayfası yalnızca e-posta linkiyle yayında olabilir.

## 4. İçerik Mimarisi

Veritabanı ve yönetim paneli yok; tüm içerik repoda Markdown olarak durur.

```
src/content/
  notes/   tr/<slug>.md    en/<slug>.md
  blog/    tr/<slug>.md    en/<slug>.md
  events/  tr/<slug>.md    en/<slug>.md
public/
  pdf/notes/<slug>.pdf     # indirilebilir not PDF'leri
  cv/hakan-mulayim-cv.pdf  # hazır olunca
```

### Frontmatter şemaları (Astro content collections, zod ile doğrulanır)

**notes:** `title`, `description`, `date`, `category` (AP | IB | SAT | TMUA | Olimpiyat | Matematik | Ekonomi), `pdf` (opsiyonel, `/pdf/notes/...` yolu), `draft` (varsayılan false)

**blog:** `title`, `description`, `date`, `tags` (dizi), `draft`

**events:** `title`, `description`, `eventDate`, `location` (opsiyonel), `registrationUrl` (opsiyonel), `draft`

- TR ve EN içerikler ayrı dosyalardır; birebir çeviri zorunluluğu yoktur
  (bir not yalnızca tek dilde var olabilir; liste sayfaları o dilde mevcut olanları gösterir).
- İçerik ekleme akışı: kullanıcı Claude'a ekletmek istediği içeriği söyler →
  Markdown dosyası oluşturulur → git push → Cloudflare Pages otomatik derler ve yayınlar (1-2 dk).

## 5. Teknik Tasarım

- **Astro 5**, tam statik çıktı (`output: 'static'`). SSR gerekmiyor.
- **i18n:** Astro yerleşik i18n yönlendirmesi — `defaultLocale: 'tr'`, `locales: ['tr','en']`,
  `prefixDefaultLocale: false`. UI metinleri (menü, düğmeler) merkezi bir sözlük
  dosyasından gelir (`src/i18n/`).
- **Tailwind CSS** ile sade-akademik tema: temiz tipografi (başlıklar için serif,
  gövde için sans-serif), bol beyaz alan, tek vurgu rengi (koyu lacivert),
  içerik odaklı düzen, mobil uyumlu. Karanlık mod: sistem tercihine göre otomatik.
- **KaTeX:** `remark-math` + `rehype-katex`; Markdown içinde `$...$` / `$$...$$` desteklenir.
- **SEO:** her sayfada `hreflang` alternatif etiketleri, otomatik sitemap
  (`@astrojs/sitemap`), Open Graph kartları, açıklama meta'ları.
- **İletişim formu:** Web3Forms access key ile statik form; honeypot alanı ile spam koruması.
  Anahtar hazır olana kadar form gösterilmez; iletişim sayfası e-posta linkiyle çalışır.
- **Erişilebilirlik:** semantik HTML, yeterli kontrast, klavye ile gezinme.

## 6. Yayınlama Hattı ve Altyapı

1. Kod GitHub deposunda (`hakanmulayim-web`). Varsayılan: **private** (taslak
   içerikler herkese açık olmaz); kullanıcı isterse sonradan public yapılabilir.
   Cloudflare Pages private depolarla sorunsuz çalışır.
2. Cloudflare Pages depoya bağlanır; her push'ta otomatik build (`astro build`) ve yayın.
3. İlk yayın `<proje>.pages.dev` adresinde doğrulanır.
4. Özel alan adı: Cloudflare'e `hakanmulayim.com` zone'u eklenir; GoDaddy'de
   nameserver'lar Cloudflare'in verdikleriyle değiştirilir (değiştirmeden önce mevcut
   kayıtlar not edilir — geri dönüş yolu). `hakanmulayim.com` ve `www.hakanmulayim.com`
   Pages projesine bağlanır; `www` → kök yönlendirmesi yapılır. SSL otomatik.
5. DNS yayılması: genelde 15 dk – 2 saat; 48 saate kadar uzayabilir.

## 7. Kurulum Aşamaları ve Görev Dağılımı

Hesap açma, şifre girme, sözleşme/onay tıklama adımları güvenlik gereği her zaman
kullanıcıya aittir; Claude Chrome üzerinden adım adım yönlendirir.

| Aşama | İş | Kim |
|---|---|---|
| 1. Site inşası | Astro projesi, tema, tüm sayfalar (TR+EN), placeholder içerik: 2-3 örnek ders notu (formüllü), 1 blog yazısı, 1 etkinlik; yerel önizleme ile birlikte kontrol | Claude |
| 2. GitHub | Giriş (kullanıcı), depo oluşturma ve push (Claude yönlendirir/yürütür) | Birlikte |
| 3. Cloudflare Pages | Ücretsiz hesap açma (kullanıcı), depo bağlama, build ayarları, ilk yayın | Birlikte |
| 4. Domain bağlama | Cloudflare zone ekleme, GoDaddy'de nameserver değişikliği, `www`+kök bağlama, SSL doğrulama | Birlikte |
| 5. Entegrasyonlar | Web3Forms anahtarı (kullanıcının e-postasıyla), istenirse Calendly hesabı ve bağlantısı, WhatsApp numarası ekleme | Birlikte |
| 6. Gerçek içerik | CV, fotoğraf, gerçek notlar hazır oldukça Claude ile eklenir | Sürekli |

## 8. Başarı Ölçütleri (Kabul Kriterleri)

- [ ] `hakanmulayim.com` ve `www.hakanmulayim.com` SSL ile açılıyor
- [ ] Tüm sayfalar TR ve EN'de mevcut; dil düğmesi karşılıklı çalışıyor
- [ ] Örnek ders notunda KaTeX formülleri doğru görüntüleniyor
- [ ] Örnek notta PDF indirme düğmesi çalışıyor
- [ ] Ders notları kategori filtresi çalışıyor
- [ ] İletişim formu test mesajını kullanıcının e-postasına ulaştırıyor
- [ ] WhatsApp ve e-posta bağlantıları doğru hedefe gidiyor
- [ ] Mobilde (375px) düzen bozulmuyor
- [ ] Markdown dosyası ekleyip push edince site otomatik güncelleniyor
- [ ] Lighthouse performans ve SEO puanları 90+

## 9. Kapsam Dışı (Şimdilik)

- Yönetim paneli / CMS arayüzü (içerik Claude ile yönetilecek)
- Üyelik, yorum, ödeme sistemleri
- Bülten (newsletter) aboneliği — ileride eklenebilir
- Video barındırma (harici bağlantı her zaman eklenebilir)
- Analitik — istenirse Cloudflare Web Analytics (çerezsiz) tek satırla eklenebilir

## 10. Riskler ve Önlemler

| Risk | Önlem |
|---|---|
| Nameserver değişikliği sırasında hata | Mevcut GoDaddy DNS kayıtları değişiklikten önce not edilir; geri dönülebilir |
| DNS yayılım gecikmesi | Site `pages.dev` adresinde zaten canlı; bekleme süresi kritik değil |
| Form spam'i | Web3Forms honeypot; gerekirse Cloudflare Turnstile eklenir |
| Kullanıcının GitHub alışkanlığı az | Tüm git işlemlerini Claude yürütür; kullanıcı yalnızca giriş/onay yapar |
| Placeholder içeriğin canlıda görünmesi | Placeholder'lar gerçekçi ama açıkça örnek olarak işaretli; gerçek içerik geldikçe değiştirilir |
