import { useState } from 'react';
import api from '../../api/client';

export default function InquiryForm({ type, meta = {}, extraFields, submitLabel = 'Submit' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await api.post(`/inquiries/${type}`, { ...form, meta });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="alert alert-success" role="status">
        Thank you — your submission has been received. We will get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {extraFields}
      <div className="mb-3">
        <label className="form-label" htmlFor={`${type}-name`}>Full Name</label>
        <input
          id={`${type}-name`}
          className="form-control"
          required
          minLength={2}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor={`${type}-email`}>Email</label>
          <input
            id={`${type}-email`}
            type="email"
            className="form-control"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="col-12 col-sm-6">
          <label className="form-label" htmlFor={`${type}-phone`}>Phone (optional)</label>
          <input
            id={`${type}-phone`}
            className="form-control"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${type}-message`}>Message</label>
        <textarea
          id={`${type}-message`}
          className="form-control"
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>
      {status === 'error' && <div className="alert alert-danger py-2">{errorMsg}</div>}
      <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : submitLabel}
      </button>
    </form>
  );
}
