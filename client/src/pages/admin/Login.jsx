import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-cream">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-5">
            <div className="card border-0 shadow-sm p-4">
              <h1 className="h4 mb-1">Lobito Farms CMS</h1>
              <p className="text-muted-warm small mb-4">Sign in to manage content.</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input id="email" type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input id="password" type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
