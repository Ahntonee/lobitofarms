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
      })
      .catch(() => setError(true));
  }, [slug]);

  useEffect(load, [load]);

  return { page, error, reload: load };
}
