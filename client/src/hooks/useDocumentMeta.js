import { useEffect } from 'react';

// Dependency-free per-page <title> and meta-description management. Without this,
// every page shares index.html's single static title/description, which is a real
// on-page SEO problem (duplicate titles/descriptions across every page Google indexes).
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
