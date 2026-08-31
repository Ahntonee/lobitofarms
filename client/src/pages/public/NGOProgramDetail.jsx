import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { LoadingState, ErrorState } from '../../components/ui/LoadingState';

export default function NGOProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [error, setError] = useState(false);

  function load() {
    setError(false);
    setProgram(null);
    api
      .get(`/ngo-programs/slug/${slug}`)
      .then((res) => setProgram(res.data))
      .catch(() => setError(true));
  }
  useEffect(load, [slug]);

  if (error) return <ErrorState message="Program not found." onRetry={load} />;
  if (!program) return <LoadingState />;

  return (
    <section className="section">
      <div className="container">
        <nav className="small mb-3">
          <Link to="/ngo" className="text-muted-warm">← Back to Foundation</Link>
        </nav>
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {program.image && <img src={program.image} alt={program.title} className="rounded-4 w-100" style={{ maxHeight: 420, objectFit: 'cover' }} />}
          </div>
          <div className="col-12 col-lg-6">
            <span className="eyebrow">{program.category}</span>
            <h1 className="h2 fw-bold mt-1 mb-3">{program.title}</h1>
            <p className="text-muted-warm fs-6">{program.description}</p>
            <dl className="row mt-4">
              <dt className="col-4">Beneficiaries</dt>
              <dd className="col-8">{program.beneficiaries?.toLocaleString() || '—'}</dd>
              <dt className="col-4">Location</dt>
              <dd className="col-8">{program.location || '—'}</dd>
            </dl>
            <div className="d-flex gap-3 mt-4">
              <Link to="/ngo/donate" className="btn btn-accent">Support This Program</Link>
              <Link to="/ngo/volunteer" className="btn btn-outline-primary">Volunteer</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
