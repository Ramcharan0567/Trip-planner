export function TransportHub({
  viewMode,
  realFlights,
  realTrains,
  realBuses,
  realHotels,
  realCabs,
  userProfile,
  onOpenProfile,
  startCheckout,
  formatMoney
}) {
  return (
    <>
      {/* VIEW 2: REAL FLIGHTS BOOKING HUB */}
      {viewMode === 'flights' && (
        <div>
          <div className="home-transport-banner">
            <div className="home-transport-info">
              <div className="home-transport-icon">✈️</div>
              <div className="home-transport-text">
                <h4>Flight Origin: {userProfile?.homeCity || 'Chennai'}, {userProfile?.homeCountry || 'India'}</h4>
                <p>Showing flights departing from your home country ({userProfile?.homeCountry || 'India'}).</p>
              </div>
            </div>
            <button
              type="button"
              className="action-btn"
              style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              onClick={onOpenProfile}
            >
              ⚙️ Update Profile Location
            </button>
          </div>
          <div className="commercial-card-grid">
            {realFlights.map((f) => (
              <div className="commercial-card" key={f.code}>
                <div>
                  <div className="commercial-card-header">
                    <div className="commercial-carrier-logo">
                      <div className="carrier-badge-icon">✈️</div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{f.carrier}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.code} · {f.class}</span>
                      </div>
                    </div>
                    <span className="commercial-price">{formatMoney(f.priceUSD)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{f.time.split(' ➔ ')[0]}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Departure</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700' }}>{f.duration}</span>
                      <div style={{ width: '60px', height: '2px', background: 'var(--accent-primary)', margin: '4px auto' }} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{f.time.split(' ➔ ')[1]}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arrival</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                    <span>🧳 {f.bag}</span>
                    <span>⚡ Instant Confirmation</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="booking-btn"
                  onClick={() => startCheckout(f)}
                >
                  Book Flight Ticket ↗
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: REAL TRAINS BOOKING HUB */}
      {viewMode === 'trains' && (
        <div>
          <div className="home-transport-banner">
            <div className="home-transport-info">
              <div className="home-transport-icon">🚆</div>
              <div className="home-transport-text">
                <h4>Rail Network Origin: {userProfile?.homeCity || 'Chennai'}, {userProfile?.homeCountry || 'India'}</h4>
                <p>Showing train routes and connections for travellers living in {userProfile?.homeCountry || 'India'}.</p>
              </div>
            </div>
            <button
              type="button"
              className="action-btn"
              style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              onClick={onOpenProfile}
            >
              ⚙️ Update Profile Location
            </button>
          </div>
          <div className="commercial-card-grid">
            {realTrains.map((tr) => (
              <div className="commercial-card" key={tr.code}>
                <div>
                  <div className="commercial-card-header">
                    <div className="commercial-carrier-logo">
                      <div className="carrier-badge-icon" style={{ background: '#f59e0b' }}>🚆</div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{tr.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tr.code} · {tr.carrier}</span>
                      </div>
                    </div>
                    <span className="commercial-price">{formatMoney(tr.priceUSD)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{tr.time.split(' ➔ ')[0]}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Boarding</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: '700' }}>{tr.duration}</span>
                      <div style={{ width: '60px', height: '2px', background: '#d97706', margin: '4px auto' }} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{tr.time.split(' ➔ ')[1]}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Destination</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                    <span>💺 {tr.class}</span>
                    <span style={{ color: '#059669' }}>✓ {tr.seats}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="booking-btn"
                  style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
                  onClick={() => startCheckout(tr)}
                >
                  Book Train Ticket ↗
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: REAL BUSES & VOLVO SLEEPERS HUB */}
      {viewMode === 'buses' && (
        <div className="commercial-card-grid">
          {realBuses.map((b) => (
            <div className="commercial-card" key={b.code}>
              <div>
                <div className="commercial-card-header">
                  <div className="commercial-carrier-logo">
                    <div className="carrier-badge-icon" style={{ background: '#10b981' }}>🚌</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{b.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.code} · {b.carrier}</span>
                    </div>
                  </div>
                  <span className="commercial-price">{formatMoney(b.priceUSD)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{b.time.split(' ➔ ')[0]}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Boarding</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>{b.duration}</span>
                    <div style={{ width: '60px', height: '2px', background: '#10b981', margin: '4px auto' }} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{b.time.split(' ➔ ')[1]}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Drop-off</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                  <span>🚌 {b.class}</span>
                  <span style={{ color: '#059669' }}>✓ {b.seats}</span>
                </div>
              </div>

              <button
                type="button"
                className="booking-btn"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                onClick={() => startCheckout(b)}
              >
                Book Bus Seat ↗
              </button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 5: LUXURY HOTELS & RESORTS */}
      {viewMode === 'hotels' && (
        <div className="commercial-card-grid">
          {realHotels.map((h) => (
            <div className="commercial-card" key={h.title}>
              <div>
                <img src={h.img} alt={h.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{h.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: '700', marginBottom: '4px' }}>{h.rating}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>📍 {h.loc}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {h.tags.map((t) => (
                    <span key={t} style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per Night</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{formatMoney(h.priceUSD)}</div>
                </div>
                <button
                  type="button"
                  className="booking-btn"
                  style={{ width: 'auto', padding: '8px 16px' }}
                  onClick={() => startCheckout(h)}
                >
                  Reserve Room ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 6: CABS & CAR RENTALS */}
      {viewMode === 'cabs' && (
        <div className="commercial-card-grid">
          {realCabs.map((c) => (
            <div className="commercial-card" key={c.title}>
              <div>
                <div className="commercial-card-header">
                  <div className="commercial-carrier-logo">
                    <div className="carrier-badge-icon" style={{ background: '#8b5cf6' }}>🚕</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{c.title}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.type} · {c.capacity}</span>
                    </div>
                  </div>
                  <span className="commercial-price">{formatMoney(c.priceUSD)}</span>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: '12px 0 16px 0' }}>{c.feature}</p>
              </div>
              <button
                type="button"
                className="booking-btn"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}
                onClick={() => startCheckout(c)}
              >
                Book Cab Ride ↗
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
