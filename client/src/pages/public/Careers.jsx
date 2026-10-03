import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import useDocumentMeta from '../../hooks/useDocumentMeta';

export default function Careers() {
  useDocumentMeta(
    'Careers | Lobito Farms',
    'Openings across our farm operations, export team, and foundation at Lobito Farms.'
  );

  return (
    <>
      <PageHeader eyebrow="Join Us" title="Careers" subtitle="Openings across our farm operations, export team, and foundation." />
      <section className="section">
        <div className="container">
          <div className="alert alert-light border">
            No open positions right now — check back soon, or reach out via our{' '}
            <Link to="/contact">contact page</Link> to introduce yourself for future roles.
          </div>
        </div>
      </section>
    </>
  );
}
