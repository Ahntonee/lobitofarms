import useCountUp from '../ui/useCountUp';

function Stat({ label, value }) {
  const [ref, count] = useCountUp(Number(value) || 0);
  return (
    <div className="col-6 col-md-3 text-center" ref={ref}>
      <div className="display-6 fw-bold text-accent">{count.toLocaleString()}</div>
      <div className="text-muted-warm small text-uppercase" style={{ letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

export default function StatCountersBlock({ config = {} }) {
  const stats = config.stats || [];
  return (
    <section className="section bg-primary text-white">
      <div className="container">
        <div className="row g-4">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
