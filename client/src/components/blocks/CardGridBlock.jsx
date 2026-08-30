import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { LoadingState } from '../ui/LoadingState';

const SOURCE_CONFIG = {
  crops: { endpoint: '/crops', base: '/crops', image: (d) => d.images?.[0], title: (d) => d.name, text: (d) => d.description },
  products: { endpoint: '/products', base: '/products', image: (d) => d.images?.[0], title: (d) => d.name, text: (d) => d.description },
  ngoPrograms: { endpoint: '/ngo-programs', base: '/ngo/programs', image: (d) => d.image, title: (d) => d.title, text: (d) => d.description },
  blog: { endpoint: '/blog', base: '/blog', image: (d) => d.coverImage, title: (d) => d.title, text: (d) => d.excerpt },
};

export default function CardGridBlock({ config = {} }) {
  const { heading, source = 'crops', limit = 3 } = config;
  const sourceConfig = SOURCE_CONFIG[source] || SOURCE_CONFIG.crops;
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get(sourceConfig.endpoint)
      .then((res) => {
        if (!cancelled) setItems(res.data.slice(0, limit));
      })
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, [sourceConfig.endpoint, limit]);

  return (
    <section className="section">
      <div className="container">
        {heading && <h2 className="h3 fw-bold mb-4 text-center">{heading}</h2>}
        {items === null ? (
          <LoadingState />
        ) : items.length === 0 ? null : (
          <div className="row g-4">
            {items.map((item) => (
              <div className="col-12 col-sm-6 col-lg-4" key={item._id}>
                <Link to={`${sourceConfig.base}/${item.slug}`} className="text-decoration-none text-reset">
                  <div className="card h-100 card-hover">
                    {sourceConfig.image(item) && (
                      <img src={sourceConfig.image(item)} className="card-img-top" alt={sourceConfig.title(item)} loading="lazy" style={{ height: 200, objectFit: 'cover' }} />
                    )}
                    <div className="card-body">
                      <h3 className="h5 card-title">{sourceConfig.title(item)}</h3>
                      <p className="card-text text-muted-warm line-clamp-3">{sourceConfig.text(item)}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
