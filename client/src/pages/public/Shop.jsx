import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import InquiryForm from '../../components/ui/InquiryForm';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/LoadingState';
import usePageBySlug from '../../hooks/usePageBySlug';

export default function Shop() {
  const { page } = usePageBySlug('shop');
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(false);
  const [quantities, setQuantities] = useState({});

  function load() {
    setError(false);
    setProducts(null);
    api.get('/products').then((res) => setProducts(res.data)).catch(() => setError(true));
  }
  useEffect(load, []);

  function updateQuantity(id, value) {
    const qty = Math.max(0, Math.floor(Number(value)) || 0);
    setQuantities((q) => ({ ...q, [id]: qty }));
  }

  const selectedItems = useMemo(
    () => (products || []).filter((p) => quantities[p._id] > 0).map((p) => ({ product: p, quantity: quantities[p._id] })),
    [products, quantities]
  );

  const orderMeta = {
    items: selectedItems.map(({ product, quantity }) => `${product.name} x${quantity}`).join(', '),
    itemCount: selectedItems.length,
  };

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
            <EmptyState message="No products available for order right now." />
          ) : (
            <div className="row g-5">
              <div className="col-12 col-lg-7">
                <h2 className="h5 mb-3">Select Products &amp; Quantities</h2>
                <div className="d-flex flex-column gap-3">
                  {products.map((p) => (
                    <div className="card border-0 shadow-sm" key={p._id}>
                      <div className="row g-0 align-items-center">
                        {p.images?.[0] && (
                          <div className="col-3 col-sm-2">
                            <img src={p.images[0]} alt={p.name} className="w-100 h-100 rounded-start" style={{ objectFit: 'cover', minHeight: 80 }} loading="lazy" />
                          </div>
                        )}
                        <div className={p.images?.[0] ? 'col-9 col-sm-10' : 'col-12'}>
                          <div className="card-body py-2">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                              <div>
                                <h3 className="h6 mb-0">{p.name}</h3>
                                <div className="small text-muted-warm">MOQ: {p.moq || '—'} · {p.packaging || '—'}</div>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <label className="small text-muted-warm mb-0" htmlFor={`qty-${p._id}`}>Qty</label>
                                <input
                                  id={`qty-${p._id}`}
                                  type="number"
                                  min="0"
                                  className="form-control form-control-sm"
                                  style={{ width: 90 }}
                                  value={quantities[p._id] || ''}
                                  placeholder="0"
                                  onChange={(e) => updateQuantity(p._id, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="card border-0 shadow-sm p-4" style={{ position: 'sticky', top: 90 }}>
                  <h2 className="h5 mb-3">Your Order Request</h2>
                  {selectedItems.length === 0 ? (
                    <p className="text-muted-warm small">Select a quantity for at least one product to request an order.</p>
                  ) : (
                    <ul className="list-unstyled small text-muted-warm mb-3">
                      {selectedItems.map(({ product, quantity }) => (
                        <li key={product._id}>{product.name} × {quantity}</li>
                      ))}
                    </ul>
                  )}
                  <InquiryForm
                    type="order"
                    meta={orderMeta}
                    submitLabel="Request This Order"
                    disabled={selectedItems.length === 0}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
