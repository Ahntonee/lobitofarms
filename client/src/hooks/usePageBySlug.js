import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';

export default function usePageBySlug(slug) {
  const [page, setPage] = useState(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setPage(null);
    api
      .get(`/pages/slug/${slug}`)
      .then((res) => {
        setPage(res.data);
        if (res.data.seo?.metaTitle) document.title = res.data.seo.metaTitle;
        if (res.data.seo?.metaDescription) {
          let tag = document.querySelector('meta[name="description"]');
          if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', 'description');
            document.head.appendChild(tag);
          }
          tag.setAttribute('content', res.data.seo.metaDescription);
        }
      })
      .catch(() => setError(true));
  }, [slug]);

  useEffect(load, [load]);

  return { page, error, reload: load };
}
