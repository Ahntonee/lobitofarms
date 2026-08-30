export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-primary text-white section-tight">
      <div className="container">
        {eyebrow && <div className="eyebrow mb-2" style={{ color: '#cfe3d1' }}>{eyebrow}</div>}
        <h1 className="display-6 fw-bold mb-2">{title}</h1>
        {subtitle && <p className="fs-6 mb-0" style={{ color: '#d9e5da', maxWidth: 640 }}>{subtitle}</p>}
      </div>
    </section>
  );
}
