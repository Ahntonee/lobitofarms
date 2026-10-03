import PageHeader from '../../components/ui/PageHeader';
import InquiryForm from '../../components/ui/InquiryForm';
import useDocumentMeta from '../../hooks/useDocumentMeta';

export default function Volunteer() {
  useDocumentMeta(
    'Volunteer | Lobito Farms',
    'Join a Farmer Field School session, a water project build, or a cooperative training day with Lobito Farms.'
  );

  return (
    <>
      <PageHeader eyebrow="Foundation" title="Get Involved" subtitle="Join a Farmer Field School session, a water project build, or a cooperative training day." />
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm p-4">
                <InquiryForm type="volunteer" submitLabel="Sign Up to Volunteer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
