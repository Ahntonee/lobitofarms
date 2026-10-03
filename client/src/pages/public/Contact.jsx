import PageHeader from '../../components/ui/PageHeader';
import InquiryForm from '../../components/ui/InquiryForm';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import useDocumentMeta from '../../hooks/useDocumentMeta';

export default function Contact() {
  const settings = useSiteSettings();

  useDocumentMeta(
    'Contact Us | Lobito Farms',
    'Questions about sourcing, partnerships, or our foundation programs — get in touch with Lobito Farms.'
  );

  return (
    <>
      <PageHeader eyebrow="Get in Touch" title="Contact Us" subtitle="Questions about sourcing, partnerships, or our foundation programs — reach out." />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <h2 className="h5 mb-3">Contact Details</h2>
              <ul className="list-unstyled d-flex flex-column gap-2 text-muted-warm">
                {settings.contactEmail && <li><strong>Email:</strong> {settings.contactEmail}</li>}
                {settings.contactPhone && <li><strong>Phone:</strong> {settings.contactPhone}</li>}
                {settings.address && <li><strong>Address:</strong> {settings.address}</li>}
              </ul>
              <div className="ratio ratio-4x3 rounded-4 overflow-hidden mt-4 bg-cream-dark d-flex align-items-center justify-content-center text-muted-warm">
                Map placeholder — connect a maps provider to embed a live location.
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm p-4">
                <InquiryForm type="contact" submitLabel="Send Message" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
