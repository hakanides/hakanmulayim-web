/** Tek sayfalık site: yalnızca ana sayfa iki dilde var. */
export const routeMap: Record<string, string> = { '/': '/en/' };

/** Mevcut yolun diğer dildeki karşılığı. Ana sayfa dışındaki her yol diğer dilin ana sayfasına düşer. */
export function getAlternatePath(path: string): string {
  const clean = path.replace(/\/+$/, '') || '/';
  const isEn = clean === '/en' || clean.startsWith('/en/');
  return isEn ? '/' : '/en/';
}
