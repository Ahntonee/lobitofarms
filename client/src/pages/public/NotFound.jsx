import { Link } from 'react-router-dom';
import useNoIndex from '../../hooks/useNoIndex';

export default function NotFound() {
  useNoIndex(true);
  return (
    <section className="section text-center">
      <div className="container">
        <h1 className="display-4 fw-bold">404</h1>
        <p className="text-muted-warm mb-4">We couldn't find that page.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </section>
  );
}
