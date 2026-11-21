import { useEffect } from 'react';
import { setNoIndex } from '../utils/meta';

// Pages that don't exist are served as HTTP 200 by the SPA shell, which Google reports as
// "soft 404". Marking them noindex while they're showing tells Google to drop them.
export default function useNoIndex(active) {
  useEffect(() => {
    if (!active) return undefined;
    setNoIndex(true);
    return () => setNoIndex(false);
  }, [active]);
}
