const slugsReservados = new Set([
  '_next',
  'api',
  'favicon.ico',
  'icons',
  'manifest.webmanifest',
  'opengraph-image',
  'robots.txt',
  'serwist',
  'sitemap.xml',
  'sw.js',
  '~offline',
])

const slugReservado = (slug: string) => slugsReservados.has(slug.toLowerCase())

export { slugReservado }
