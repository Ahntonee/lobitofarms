import fixture from './fixture.json';

// Demo-only fallback for the static (GitHub Pages) build, which has no backend behind
// it. When a request fails, we try to answer it from a frozen snapshot of the real
// seeded data instead of showing an error — so a static preview link still looks like
// a real site. Only public, read-only content endpoints are covered; admin/auth/write
// requests are left to fail normally (there is no admin functionality on a static host).
// Only ever engaged in production builds — see client.js — so local dev against the
// real API is completely unaffected.

const LIST_SOURCES = {
  crops: fixture.crops,
  products: fixture.products,
  'ngo-programs': fixture.ngoPrograms,
  blog: fixture.blog,
};

export default function resolveFromFixture(config) {
  if ((config.method || 'get').toLowerCase() !== 'get') return undefined;

  const url = (config.url || '').replace(/^\/+/, '').replace(/\/+$/, '');

  if (url === 'site-settings') return fixture.siteSettings;
  if (url === 'testimonials') return fixture.testimonials;

  const pageMatch = url.match(/^pages\/slug\/([^/]+)$/);
  if (pageMatch) return fixture.pages[pageMatch[1]];

  for (const [key, list] of Object.entries(LIST_SOURCES)) {
    if (url === key) return list;

    const slugMatch = url.match(new RegExp(`^${key}/slug/([^/]+)$`));
    if (slugMatch) return list.find((item) => item.slug === slugMatch[1]);
  }

  return undefined;
}
