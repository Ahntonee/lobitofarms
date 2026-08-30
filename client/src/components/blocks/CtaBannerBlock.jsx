import { Link } from 'react-router-dom';

export default function CtaBannerBlock({ config = {} }) {
  const { heading, subheading, cta } = config;
  return (
    <section className="section bg-primary-dark text-white text-center">
      <div className="container">
        <h2 className="h3 fw-bold mb-2">{heading}</h2>
        {subheading && <p className="mb-4" style={{ color: '#d9e5da' }}>{subheading}</p>}
        {cta?.href && (
          <Link to={cta.href} className="btn btn-accent btn-lg">
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
