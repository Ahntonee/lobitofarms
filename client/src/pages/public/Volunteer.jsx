import InquiryForm from '../../components/ui/InquiryForm';
import BlockRenderer from '../../components/blocks/BlockRenderer';
import usePageBySlug from '../../hooks/usePageBySlug';

export default function Volunteer() {
  const { page } = usePageBySlug('ngo-volunteer');

  return (
    <>
      {page && <BlockRenderer blocks={page.blocks} />}
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
