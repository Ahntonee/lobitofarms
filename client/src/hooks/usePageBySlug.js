import { useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { setMeta } from '../utils/meta';

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
        setMeta(res.data.seo?.metaTitle, res.data.seo?.metaDescription);
      })
      .catch(() => setError(true));
  }, [slug]);

  useEffect(load, [load]);

  return { page, error, reload: load };
}
