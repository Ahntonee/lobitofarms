import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 0 && h < 4)  return { line1: 'Hello, Night Owl!', line2: 'Welcome back — burning the midnight oil?' };
  if (h >= 4 && h < 12) return { line1: 'Good Morning!', line2: 'Welcome back. Ready to manage today?' };
  if (h >= 12 && h < 17) return { line1: 'Good Afternoon!', line2: 'Welcome back. Hope the day is going well.' };
  if (h >= 17 && h < 21) return { line1: 'Good Evening!', line2: 'Welcome back. Wrapping things up?' };
  return { line1: 'Good Night!', line2: 'Welcome back. Almost time to rest.' };
}

export default function Login() {
  const { login, user } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const greeting = getGreeting();

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
      {/* Left panel */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: '45%',
          background: 'linear-gradient(145deg, #2d5a27 0%, #1a3a16 60%, #0f2410 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', bottom: -80, left: -80,
        }} />
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', bottom: 100, left: 160,
        }} />
        <div style={{
          position: 'absolute', width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(214,143,60,0.15)', top: 80, right: 40,
        }} />

        {/* Logo */}
        <div>
          <img
            src="/images/lobito_logo.webp"
            alt="Lobito Farms"
            style={{ height: 72, clipPath: 'circle(46%)' }}
          />
        </div>

        {/* Welcome text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(214,143,60,0.2)',
            color: '#d68f3c', fontSize: 11, fontWeight: 700, letterSpacing: 2,
            padding: '4px 12px', borderRadius: 20, marginBottom: 16,
          }}>
            CONTENT MANAGEMENT
          </div>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Welcome to<br />Lobito Farms
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
            Manage your crops, products, NGO programs, blog content, and site settings from one place.
          </p>
        </div>

        {/* Bottom tagline */}
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
          © {new Date().getFullYear()} Lobito Farms Ltd. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div
        className="flex-grow-1 d-flex align-items-center justify-content-center p-4"
        style={{ background: '#fff' }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          <div className="d-flex justify-content-center mb-4">
            <img src="/images/lobito_logo.webp" alt="Lobito Farms" style={{ height: 80, clipPath: 'circle(46%)' }} />
          </div>

          {/* Dynamic greeting */}
          <div className="text-center mb-4">
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{greeting.line1}</h1>
            <p style={{ color: '#888', fontSize: 14, margin: 0 }}>{greeting.line2}</p>
          </div>

          <hr style={{ borderColor: '#f0f0f0', marginBottom: 28 }} />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email" style={{ fontWeight: 500, fontSize: 14 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 16 }}>
                  ✉
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  className="form-control"
                  style={{ paddingLeft: 36, borderRadius: 8, border: '1.5px solid #e0e0e0', height: 46 }}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="password" style={{ fontWeight: 500, fontSize: 14 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 16 }}>
                  🔒
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-control"
                  style={{ paddingLeft: 36, paddingRight: 56, borderRadius: 8, border: '1.5px solid #e0e0e0', height: 46 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#888', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', padding: '0 4px',
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 mb-3" style={{ borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', height: 48, background: '#2d5a27', color: '#fff',
                border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15,
                cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
