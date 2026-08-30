export default function TextImageBlock({ config = {} }) {
  const { heading, body, image, imagePosition = 'right' } = config;
  const imageCol = (
    <div className="col-12 col-lg-6">
      <img src={image} alt={heading || ''} className="rounded-4 w-100" style={{ objectFit: 'cover', maxHeight: 420 }} loading="lazy" />
    </div>
  );
  const textCol = (
    <div className="col-12 col-lg-6 d-flex flex-column justify-content-center">
      {heading && <h2 className="h3 fw-bold mb-3">{heading}</h2>}
      {body && <div className="text-muted-warm" dangerouslySetInnerHTML={{ __html: body }} />}
    </div>
  );

  return (
    <section className="section">
      <div className="container">
        <div className="row g-4 align-items-center">
          {imagePosition === 'left' ? (
            <>
              {imageCol}
              {textCol}
            </>
          ) : (
            <>
              {textCol}
              {imageCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
