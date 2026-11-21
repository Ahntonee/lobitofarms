// Single place that owns <head> tags set from React, so titles, canonicals and
// social-preview tags never drift apart.
export const SITE_URL = 'https://lobitofarmsltd.com';

function upsert(selector, attrs) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    Object.entries(attrs).forEach(([k, v]) => k !== 'content' && k !== 'href' && tag.setAttribute(k, v));
    document.head.appendChild(tag);
  }
  if (attrs.content !== undefined) tag.setAttribute('content', attrs.content);
  if (attrs.href !== undefined) tag.setAttribute('href', attrs.href);
}

export function setMeta(title, description) {
  if (title) {
    document.title = title;
    upsert('meta[property="og:title"]', { property: 'og:title', content: title });
    upsert('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  }
  if (description) {
    upsert('meta[name="description"]', { name: 'description', content: description });
    upsert('meta[property="og:description"]', { property: 'og:description', content: description });
    upsert('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  }
}

export function setCanonical(pathname) {
  const path = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const url = `${SITE_URL}${path}`;
  upsert('link[rel="canonical"]', { rel: 'canonical', href: url });
  upsert('meta[property="og:url"]', { property: 'og:url', content: url });
}

export function setNoIndex(on) {
  const existing = document.head.querySelector('meta[name="robots"]');
  if (on) {
    upsert('meta[name="robots"]', { name: 'robots', content: 'noindex' });
  } else if (existing) {
    existing.remove();
  }
}
