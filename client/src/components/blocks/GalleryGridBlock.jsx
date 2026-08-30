export default function GalleryGridBlock({ config = {} }) {
  const { heading, images = [] } = config;
  if (images.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        {heading && <h2 className="h3 fw-bold mb-4 text-center">{heading}</h2>}
        <div className="row g-3">
          {images.map((img, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={img.url || i}>
              <img
                src={img.url}
                alt={img.caption || ''}
                className="rounded-3 w-100"
                loading="lazy"
                style={{ height: 180, objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
