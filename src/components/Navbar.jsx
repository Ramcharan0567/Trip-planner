import { CURRENCIES } from '../data/currencies.js';

export function Navbar({
  currencyCode,
  setCurrencyCode,
  theme,
  setTheme,
  provider,
  model,
  plan,
  user,
  userProfile,
  onOpenShare,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  showToast
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="#" className="brand">
          <div className="brand-icon-wrap">✈️</div>
          <div>
            <span className="brand-name">WanderAI Travel</span>
            <span className="brand-tag">Flights, Trains, Buses, Hotels & Custom Prompt Trips</span>
          </div>
        </a>

        <div className="navbar-controls">
          {/* Currency Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)' }}>💱 Currency:</span>
            <select
              className="input-field"
              style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', background: 'var(--card-bg)' }}
              value={currencyCode}
              onChange={(e) => {
                setCurrencyCode(e.target.value);
                showToast(`💱 Switched to ${CURRENCIES[e.target.value]?.name}`);
              }}
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div className="theme-selector" aria-label="Appearance Theme">
            <button
              type="button"
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Aurora Light Theme"
            >
              ☀️ Aurora
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Cyber Dark Theme"
            >
              🌌 Cyber Dark
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === 'sunset' ? 'active' : ''}`}
              onClick={() => setTheme('sunset')}
              title="Sunset Horizon Theme"
            >
              🌅 Sunset
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === 'emerald' ? 'active' : ''}`}
              onClick={() => setTheme('emerald')}
              title="Emerald Oasis Theme"
            >
              🌿 Emerald
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === 'royal' ? 'active' : ''}`}
              onClick={() => setTheme('royal')}
              title="Royal Velvet Theme"
            >
              💜 Royal
            </button>
          </div>

          {plan && (
            <button
              type="button"
              className="action-btn"
              onClick={onOpenShare}
              title="Share & Copy Custom Trip Link"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                borderRadius: '99px',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                cursor: 'pointer'
              }}
            >
              🔗 Share Link
            </button>
          )}

          {/* Google Authentication & Profile Navbar Control */}
          {user ? (
            <div className="user-profile-menu">
              <button
                type="button"
                className="user-avatar-btn"
                onClick={onOpenProfile}
                title="Click to view & edit Profile & Home Location"
              >
                <img src={user.photoURL} alt={user.displayName} className="user-avatar-img" />
                <span>{user.displayName.split(' ')[0]}</span>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '12px', fontWeight: '700' }}>
                  📍 {userProfile.homeCountry}
                </span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}
                title="Sign Out"
              >
                🚪
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-google-login"
              style={{ padding: '6px 14px', fontSize: '0.82rem', width: 'auto' }}
              onClick={onOpenLogin}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign In with Google
            </button>
          )}

          <span className="provider-badge">
            <span className="status-dot" />
            {provider && provider !== 'demo'
              ? `Engine: ${provider.toUpperCase()}${model ? ` (${model})` : ''}`
              : 'Engine: Gemini 3.6 Flash / AI Model'}
          </span>
        </div>
      </div>
    </header>
  );
}
