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
