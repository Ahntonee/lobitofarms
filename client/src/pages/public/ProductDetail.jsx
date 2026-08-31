import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import InquiryForm from '../../components/ui/InquiryForm';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setProduct(null);
    api
      .get(`/products/slug/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError(true));
  }
  useEffect(load, [slug]);

  if (error) return <ErrorState message="Product not found." onRetry={load} />;
  if (!product) return <LoadingState />;

  return (
    <section className="section">
      <div className="container">
        <nav className="small mb-3">
          <Link to="/products" className="text-muted-warm">← Back to Products</Link>
        </nav>
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {product.images?.[0] && (
              <img src={product.images[0]} alt={product.name} className="rounded-4 w-100 mb-3" style={{ maxHeight: 420, objectFit: 'cover' }} />
            )}
            <h1 className="h2 fw-bold">{product.name}</h1>
            <p className="text-muted-warm">{product.description}</p>
            <dl className="row mt-4">
              <dt className="col-4">MOQ</dt>
              <dd className="col-8">{product.moq || '—'}</dd>
              <dt className="col-4">Packaging</dt>
              <dd className="col-8">{product.packaging || '—'}</dd>
              <dt className="col-4">Specs</dt>
              <dd className="col-8">{product.specs || '—'}</dd>
            </dl>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm p-4 bg-cream-dark bg-opacity-25">
              <h2 className="h4 mb-3">Request a Quote</h2>
              <InquiryForm type="quote" meta={{ productId: product._id, productName: product.name }} submitLabel="Request Quote" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
