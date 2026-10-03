import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import InquiryForm from '../../components/ui/InquiryForm';
import useDocumentMeta from '../../hooks/useDocumentMeta';

const AMOUNTS = [25, 50, 100, 250];

export default function Donate() {
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [frequency, setFrequency] = useState('one_time');

  useDocumentMeta(
    'Donate | Lobito Farms',
    "Your gift funds farmer training, clean water, education, and women's cooperatives through the Lobito Farms Foundation."
  );

  const finalAmount = custom ? Number(custom) : amount;

  return (
    <>
      <PageHeader eyebrow="Foundation" title="Donate" subtitle="Your gift funds farmer training, clean water, education, and women's cooperatives." />
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7">
              <div className="alert alert-warning">
                <strong>Note:</strong> Payment processing is not connected in this build. Submitting this form
                records your donation interest — our team will follow up with secure payment instructions.
              </div>
              <div className="card border-0 shadow-sm p-4">
                <h2 className="h5 mb-3">Choose an Amount</h2>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`btn ${amount === a && !custom ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setAmount(a);
                        setCustom('');
                      }}
                    >
                      ${a}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    style={{ maxWidth: 140 }}
                    placeholder="Custom $"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </div>
                <div className="btn-group mb-4" role="group" aria-label="Donation frequency">
                  <button
                    type="button"
                    className={`btn ${frequency === 'one_time' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFrequency('one_time')}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    className={`btn ${frequency === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFrequency('monthly')}
                  >
                    Monthly
                  </button>
                </div>
                <InquiryForm type="donation" meta={{ amount: finalAmount, frequency }} submitLabel={`Donate $${finalAmount || 0}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
