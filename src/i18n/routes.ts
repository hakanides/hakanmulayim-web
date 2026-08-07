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
