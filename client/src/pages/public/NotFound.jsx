import { Link } from 'react-router-dom';

export default function NotFound() {
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
