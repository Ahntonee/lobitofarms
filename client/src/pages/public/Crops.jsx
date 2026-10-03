import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/ui/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/LoadingState';
import useDocumentMeta from '../../hooks/useDocumentMeta';

export default function Crops() {
  const [crops, setCrops] = useState(null);
  const [error, setError] = useState(false);

  useDocumentMeta(
    'Our Crops | Lobito Farms',
    'Cocoa, plantain, cashew, and coffee — grown, processed, and quality-checked for export by Lobito Farms.'
  );

  function load() {
    setError(false);
    setCrops(null);
    api.get('/crops').then((res) => setCrops(res.data)).catch(() => setError(true));
  }
  useEffect(load, []);

  return (
    <>
      <PageHeader
        eyebrow="What We Grow"
        title="Our Crops"
        subtitle="Cocoa, plantain, cashew, and coffee — grown, processed, and quality-checked for export."
      />
      <section className="section">
        <div className="container">
          {error ? (
            <ErrorState onRetry={load} />
          ) : !crops ? (
            <LoadingState />
          ) : crops.length === 0 ? (
            <EmptyState message="No crops published yet." />
          ) : (
            <div className="row g-4">
              {crops.map((crop) => (
                <div className="col-12 col-sm-6 col-lg-3" key={crop._id}>
                  <Link to={`/crops/${crop.slug}`} className="text-decoration-none text-reset">
                    <div className="card h-100 card-hover">
                      {crop.images?.[0] && (
                        <img src={crop.images[0]} className="card-img-top" alt={crop.name} loading="lazy" style={{ height: 180, objectFit: 'cover' }} />
                      )}
                      <div className="card-body">
                        <span className="eyebrow">{crop.category}</span>
                        <h2 className="h5 card-title mt-1">{crop.name}</h2>
                        <p className="card-text text-muted-warm line-clamp-3 small">{crop.description}</p>
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
