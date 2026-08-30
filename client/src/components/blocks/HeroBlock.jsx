import { Link } from 'react-router-dom';

export default function HeroBlock({ config = {} }) {
  const { heading, subheading, image, primaryCta, secondaryCta } = config;

  return (
    <section className="position-relative text-white">
      <div
        className="w-100"
        style={{
          minHeight: '70vh',
          backgroundImage: `linear-gradient(180deg, rgba(31,58,34,0.65), rgba(31,58,34,0.85)), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container py-5">
          <div className="col-12 col-lg-8">
            <h1 className="display-5 fw-bold mb-3" style={{ lineHeight: 1.15 }}>{heading}</h1>
            <p className="fs-5 mb-4" style={{ color: '#eef3ea' }}>{subheading}</p>
            <div className="d-flex flex-wrap gap-3">
              {primaryCta?.href && (
                <Link to={primaryCta.href} className="btn btn-accent btn-lg">
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta?.href && (
                <Link to={secondaryCta.href} className="btn btn-outline-light btn-lg">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
