import { useEffect, useState } from 'react';
import api from '../../api/client';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/LoadingState';
import usePageBySlug from '../../hooks/usePageBySlug';

export default function Gallery() {
  const { page } = usePageBySlug('gallery');
  const [images, setImages] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setImages(null);
    Promise.all([api.get('/crops'), api.get('/products'), api.get('/ngo-programs')])
      .then(([crops, products, programs]) => {
        const all = [
          ...crops.data.flatMap((c) => (c.images || []).map((url) => ({ url, caption: c.name }))),
          ...products.data.flatMap((p) => (p.images || []).map((url) => ({ url, caption: p.name }))),
          ...programs.data.filter((p) => p.image).map((p) => ({ url: p.image, caption: p.title })),
        ];
        setImages(all);
      })
      .catch(() => setError(true));
  }
  useEffect(load, []);

  return (
    <>
      {page && <BlockRenderer blocks={page.blocks} />}
      <section className="section">
        <div className="container">
          {error ? (
            <ErrorState onRetry={load} />
          ) : !images ? (
            <LoadingState />
          ) : images.length === 0 ? (
            <EmptyState message="No photos yet." />
          ) : (
            <div className="row g-3">
              {images.map((img, i) => (
                <div className="col-6 col-md-4 col-lg-3" key={`${img.url}-${i}`}>
                  <img
                    src={img.url}
                    alt={img.caption}
                    loading="lazy"
                    className="rounded-3 w-100"
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
