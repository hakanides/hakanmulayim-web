/** TR yolu -> EN yolu. Ana sayfa '/en/' (sondaki / önemli, Astro dizin formatı). */
export const routeMap: Record<string, string> = {
  '/': '/en/',
  '/cv': '/en/cv',
  '/arastirma': '/en/research',
  '/ogretim': '/en/teaching',
  '/ders-notlari': '/en/notes',
  '/blog': '/en/blog',
  '/etkinlikler': '/en/events',
  '/iletisim': '/en/contact',
};

/**
 * Mevcut yolun diğer dildeki karşılığı. Detay sayfaları (slug'lı) diğer dilin
 * liste sayfasına düşer; bilinmeyen yollar diğer dilin ana sayfasına.
 */
export function getAlternatePath(path: string): string {
  const clean = path.replace(/\/+$/, '') || '/';
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
