import { useState } from 'react';

export function LoginModal({ isOpen, onClose, onEmailLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setError('');
    onEmailLogin(email, password, isSignUp);
    onClose();
  };

  const handleQuickDemo = () => {
    onEmailLogin('traveler@wanderai.com', 'demo123', false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card google-auth-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div className="brand-icon-big" style={{ width: '48px', height: '48px', fontSize: '1.6rem', marginBottom: '8px' }}>✈️</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem' }}>
            {isSignUp ? 'Create WanderAI Account' : 'Sign In to WanderAI'}
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
            Enter your email and password to manage custom trip itineraries.
          </p>
        </div>

        <div className="auth-tab-row" style={{ marginBottom: '16px' }}>
          <button
            type="button"
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            🔑 Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            ✨ Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-box">
          {error && <div className="auth-error-msg">⚠️ {error}</div>}

          <div className="form-group-clean">
            <label>Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group-clean">
            <label>Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-auth-submit" style={{ marginTop: '8px' }}>
            {isSignUp ? '✨ Create Account' : '🚀 Sign In'}
          </button>
        </form>

        <div className="guest-divider" style={{ margin: '16px 0 12px 0' }}>
          <span>DEMO CONVENIENCE</span>
        </div>

        <button
          type="button"
          className="btn-google-login-hero"
          onClick={handleQuickDemo}
          style={{ background: 'var(--accent-gradient)', color: '#ffffff', border: 'none', fontWeight: '800', padding: '10px 16px', fontSize: '0.9rem' }}
        >
          ⚡ One-Click Instant Sign In
        </button>

        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button
            type="button"
            className="action-btn"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
