import { useEffect, useId, useState } from 'react';
import api from '../../api/client';

export default function TestimonialCarouselBlock({ config = {} }) {
  const [testimonials, setTestimonials] = useState([]);
  const carouselId = `testimonials-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    api.get('/testimonials').then((res) => setTestimonials(res.data)).catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="section bg-cream-dark">
      <div className="container">
        {config.heading && <h2 className="h3 fw-bold mb-4 text-center">{config.heading}</h2>}
        <div id={carouselId} className="carousel slide testimonial-carousel" data-bs-ride="carousel">
          <div className="carousel-inner">
            {testimonials.map((t, i) => (
              <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={t._id}>
                <div className="mx-auto text-center px-5" style={{ maxWidth: 700 }}>
                  {t.image && (
                    <img src={t.image} alt={t.name} className="rounded-circle mb-3" width={80} height={80} style={{ objectFit: 'cover' }} />
                  )}
                  <p className="fs-5 fst-italic mb-3">&ldquo;{t.quote}&rdquo;</p>
                  <p className="fw-bold mb-0">{t.name}</p>
                  {t.role && <p className="text-muted-warm small">{t.role}</p>}
                </div>
              </div>
            ))}
          </div>
          {testimonials.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
