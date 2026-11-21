import { useEffect } from 'react';
import { setMeta } from '../utils/meta';

// Dependency-free per-page <title> and meta-description management. Without this,
// every page shares index.html's single static title/description, which is a real
// on-page SEO problem (duplicate titles/descriptions across every page Google indexes).
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    setMeta(title, description);
  }, [title, description]);
}
