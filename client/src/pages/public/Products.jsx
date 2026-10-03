import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/LoadingState';
import usePageBySlug from '../../hooks/usePageBySlug';

export default function Products() {
  const { page } = usePageBySlug('products');
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setProducts(null);
    api.get('/products').then((res) => setProducts(res.data)).catch(() => setError(true));
  }
  useEffect(load, []);

  return (
    <>
      {page && <BlockRenderer blocks={page.blocks} />}
      <section className="section">
        <div className="container">
          {error ? (
            <ErrorState onRetry={load} />
          ) : !products ? (
            <LoadingState />
          ) : products.length === 0 ? (
            <EmptyState message="No products published yet." />
          ) : (
            <div className="row g-4">
              {products.map((p) => (
                <div className="col-12 col-sm-6 col-lg-4" key={p._id}>
                  <Link to={`/products/${p.slug}`} className="text-decoration-none text-reset">
                    <div className="card h-100 card-hover">
                      {p.images?.[0] && (
                        <img src={p.images[0]} className="card-img-top" alt={p.name} loading="lazy" style={{ height: 180, objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <h2 className="h5 card-title">{p.name}</h2>
                        <p className="card-text text-muted-warm small line-clamp-3">{p.description}</p>
                        <div className="small text-muted-warm mt-2">
                          <div><strong>MOQ:</strong> {p.moq || '—'}</div>
                          <div><strong>Packaging:</strong> {p.packaging || '—'}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
