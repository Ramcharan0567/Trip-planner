export function ProfileModal({
  isOpen,
  onClose,
  user,
  userProfile,
  setUserProfile,
  travellerName,
  setTravellerName,
  travellerEmail,
  setUser,
  showToast
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
            <span>👤</span> Profile & Location Settings
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            showToast(`📍 Profile saved! Living in ${userProfile.homeCity}, ${userProfile.homeCountry}`);
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="field-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={user?.displayName || travellerName}
                onChange={(e) => {
                  setTravellerName(e.target.value);
                  if (user) setUser({ ...user, displayName: e.target.value });
                }}
                required
              />
            </div>

            <div>
              <label className="field-label">Gmail / Email Address (Confirmed)</label>
              <input
                type="email"
                className="input-field"
                value={user?.email || travellerEmail}
                readOnly
                style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                ✓ Confirmed Google OAuth Account ({user ? user.email : 'Guest Session'})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="field-label">Home Country (Living In)</label>
                <select
                  className="input-field"
                  value={userProfile.homeCountry}
                  onChange={(e) => setUserProfile({ ...userProfile, homeCountry: e.target.value })}
                  required
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="UAE">🇦🇪 United Arab Emirates</option>
                  <option value="Germany">🇩🇪 Germany</option>
                  <option value="France">🇫🇷 France</option>
                  <option value="Japan">🇯🇵 Japan</option>
                  <option value="Brazil">🇧🇷 Brazil</option>
                  <option value="Mexico">🇲🇽 Mexico</option>
                  <option value="South Africa">🇿🇦 South Africa</option>
                  <option value="South Korea">🇰🇷 South Korea</option>
                  <option value="Malaysia">🇲🇾 Malaysia</option>
                  <option value="Thailand">🇹🇭 Thailand</option>
                  <option value="Indonesia">🇮🇩 Indonesia</option>
                  <option value="Philippines">🇵🇭 Philippines</option>
                  <option value="Vietnam">🇻🇳 Vietnam</option>
                  <option value="Turkey">🇹🇷 Turkey</option>
                  <option value="Egypt">🇪🇬 Egypt</option>
                  <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                  <option value="New Zealand">🇳🇿 New Zealand</option>
                  <option value="Switzerland">🇨🇭 Switzerland</option>
                </select>
              </div>

              <div>
                <label className="field-label">Home City</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Chennai / New York"
                  value={userProfile.homeCity}
                  onChange={(e) => setUserProfile({ ...userProfile, homeCity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ background: 'var(--badge-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--badge-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--badge-text)', fontWeight: '700' }}>
                🚆 Origin Transport Notice:
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Trains and flights in the booking tabs will be dynamically updated to show services matching your home country (Living in <strong>{userProfile.homeCountry}</strong>).
              </div>
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="action-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              style={{ width: 'auto' }}
            >
              💾 Save Profile & Update Services
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
