import { useState } from 'react';

export function LoginPage({ onEmailLogin, onContinueGuest }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
  };

  const handleQuickDemo = () => {
    onEmailLogin('traveler@wanderai.com', 'demo123', false);
  };

  return (
    <div className="login-landing-container">
      <div className="login-landing-card">
        <div className="brand-logo-hero">
          <div className="brand-icon-big">✈️</div>
          <h1>WanderAI Travel</h1>
          <p className="brand-tagline">AI-Powered Commercial Trip Planner & Booking Hub</p>
        </div>

        <div className="login-box-card">
          <div className="auth-tab-row">
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

            <button type="submit" className="btn-auth-submit">
              {isSignUp ? '✨ Create Account & Enter' : '🚀 Sign In to Travel Hub'}
            </button>
          </form>

          <div className="guest-divider">
            <span>INSTANT DEMO ACCESS</span>
          </div>

          <button
            type="button"
            className="btn-google-login-hero"
            onClick={handleQuickDemo}
            style={{ background: 'var(--accent-gradient)', color: '#ffffff', border: 'none', fontWeight: '800' }}
          >
            ⚡ One-Click Instant Sign In
          </button>

          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="btn-guest-continue"
              onClick={onContinueGuest}
            >
              Continue as Guest →
            </button>
          </div>
        </div>

        <div className="features-preview-grid">
          <div className="feature-item-card">
            <span className="feature-icon">💱</span>
            <h4>Auto-Currency</h4>
            <p>40+ Currencies by Destination</p>
          </div>
          <div className="feature-item-card">
            <span className="feature-icon">🚆</span>
            <h4>Home Transport</h4>
            <p>Origin-matched Flights & Rail</p>
          </div>
          <div className="feature-item-card">
            <span className="feature-icon">📄</span>
            <h4>Instant E-Tickets</h4>
            <p>UPI, Card & NetBanking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
