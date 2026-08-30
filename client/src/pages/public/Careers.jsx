import PageHeader from '../../components/ui/PageHeader';

export default function Careers() {
  return (
    <>
      <PageHeader eyebrow="Join Us" title="Careers" subtitle="Openings across our farm operations, export team, and foundation." />
      <section className="section">
        <div className="container">
          <div className="alert alert-light border">
            No open positions right now — check back soon, or reach out via our{' '}
            <a href="/contact">contact page</a> to introduce yourself for future roles.
          </div>
        </div>
      </section>
    </>
  );
}
