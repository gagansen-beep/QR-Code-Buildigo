import { useState } from 'react';
import { useToast } from '../Toast.jsx';
import { api } from '../api.js';
import { applyServerErrors } from '../utils.js';

export function BookingLogin({ navigate }) {
  const toast = useToast();
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => { const { [key]: _, ...rest } = prev; return rest; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email    = 'Email is required';
    if (!form.password)     errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const cards = await api.verifyBooking(form.email.trim(), form.password);
      navigate('booking-table', { email: form.email.trim(), password: form.password, cards });
    } catch (err) {
      if (err.errors && applyServerErrors(err.errors, setErrors)) {
        toast.error('Please fix the errors below');
      } else {
        toast.error(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page center-page">
      <div className="login-card">
        <div className="login-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h2>My QR Cards</h2>
        <p className="text-muted" style={{ fontSize: 14 }}>
          Enter your credentials to view and manage your cards
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label">Email Address</label>
            <input
              value={form.email}
              onChange={setField('email')}
              type="email"
              placeholder="you@example.com"
              autoFocus
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="input-with-action">
              <input
                value={form.password}
                onChange={setField('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                className={errors.password ? 'input-error' : ''}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? <span className="spinner spinner-sm" /> : 'View My Cards'}
          </button>
        </form>

        <button className="link-btn" onClick={() => navigate('home')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
