import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../../utils/meta';

const BRIEF = 'Lobito Farms grows and exports premium cocoa, oil palm, plantain and cashew from cooperative farms, with a foundation investing in farming communities.';

// Floating "Share" button on every public page. Phones get the native share sheet; desktop
// gets a menu of social links plus copy-link. The shared link's preview card (title,
// description, image) comes from the Open Graph tags in index.html.
export default function ShareButton() {
  const { pathname } = useLocation();
  const [copied, setCopied] = useState(false);

  const url = `${SITE_URL}${pathname === '/' ? '' : pathname.replace(/\/$/, '')}`;
  const title = document.title || 'Lobito Farms';
  const text = pathname === '/' ? BRIEF : title;
  const enc = encodeURIComponent;

  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(text)}` },
    { label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: 'Telegram', href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}` },
    { label: 'Email', href: `mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}` },
  ];

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      /* user dismissed the share sheet */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link', url);
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share && /Mobi|Android/i.test(navigator.userAgent);

  return (
    <div className="dropup share-fab">
      {canNativeShare ? (
        <button type="button" className="btn btn-accent rounded-pill shadow" onClick={nativeShare} aria-label="Share this website">
          Share
        </button>
      ) : (
        <>
          <button type="button" className="btn btn-accent rounded-pill shadow dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Share this website">
            Share
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow">
            {targets.map((t) => (
              <li key={t.label}>
                <a className="dropdown-item" href={t.href} target="_blank" rel="noopener noreferrer">{t.label}</a>
              </li>
            ))}
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button type="button" className="dropdown-item" onClick={copyLink}>{copied ? 'Link copied ✓' : 'Copy link'}</button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
