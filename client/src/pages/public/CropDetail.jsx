import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function CropDetail() {
  const { slug } = useParams();
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setCrop(null);
    api
      .get(`/crops/slug/${slug}`)
      .then((res) => {
        setCrop(res.data);
        if (res.data.seo?.metaTitle) document.title = res.data.seo.metaTitle;
      })
      .catch(() => setError(true));
  }
  useEffect(load, [slug]);

  if (error) return <ErrorState message="Crop not found." onRetry={load} />;
  if (!crop) return <LoadingState />;

  return (
    <section className="section">
      <div className="container">
        <nav className="small mb-3">
          <Link to="/crops" className="text-muted-warm">← Back to Crops</Link>
        </nav>
        <div className="row g-5 align-items-start">
          <div className="col-12 col-lg-6">
            {crop.images?.[0] && (
              <img src={crop.images[0]} alt={crop.name} className="rounded-4 w-100 mb-3" style={{ maxHeight: 420, objectFit: 'cover' }} />
            )}
            {crop.images?.length > 1 && (
              <div className="row g-2">
                {crop.images.slice(1).map((img) => (
                  <div className="col-4" key={img}>
                    <img src={img} alt={crop.name} className="rounded-3 w-100" style={{ height: 100, objectFit: 'cover' }} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-12 col-lg-6">
            <span className="eyebrow">{crop.category}</span>
            <h1 className="display-6 fw-bold mt-1 mb-3">{crop.name}</h1>
            <p className="text-muted-warm fs-6">{crop.description}</p>
            <dl className="row mt-4">
              <dt className="col-4 col-sm-3">Season</dt>
              <dd className="col-8 col-sm-9">{crop.season || '—'}</dd>
              <dt className="col-4 col-sm-3">Export Grade</dt>
              <dd className="col-8 col-sm-9">{crop.exportGrade || '—'}</dd>
            </dl>
            <div className="d-flex gap-3 mt-4">
              <Link to="/products" className="btn btn-primary">View Products</Link>
              <Link to="/contact" className="btn btn-outline-primary">Request a Quote</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
