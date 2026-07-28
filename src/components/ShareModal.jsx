import React from 'react';

export function ShareModal({
  isOpen,
  onClose,
  plan,
  totalCostUSD,
  formatMoney,
  requestText
}) {
  if (!isOpen || !plan) return null;

  // 1. Detect dynamic port
  const activePort = typeof window !== 'undefined' ? window.location.port : '5173';
  
  // 2. Generate mobile network link using the user's Mac Local Wi-Fi IP address (192.168.29.89)
  const promptParam = encodeURIComponent(requestText || plan.destination || '');
  const mobileShareUrl = `http://192.168.29.89:${activePort}/?prompt=${promptParam}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '420px', padding: '24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '800' }}>
            <span>🔗</span> Share Custom Trip
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Trip Info Snapshot */}
        <div style={{ background: 'rgba(37,99,235,0.05)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-color)', marginBottom: '4px' }}>
            {plan.tripTitle}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>📍 {plan.destination}</span>
            <span>📅 {plan.days ? plan.days.length : 10} Days Itinerary</span>
            <span>💰 Est. {formatMoney(totalCostUSD)}</span>
          </div>
        </div>

        {/* High-Resolution QR Code Block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '20px 0', padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mobileShareUrl)}`}
            alt="Trip QR Code"
            style={{ width: '180px', height: '180px', borderRadius: '8px', border: '1px solid var(--card-border)', padding: '8px', background: '#ffffff', objectFit: 'contain', marginBottom: '14px' }}
          />
          <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-color)', marginBottom: '4px' }}>
            📲 Scan QR Code to Open on Phone
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: '1.4' }}>
            Scan with your phone camera. Make sure your phone is connected to the same Wi-Fi network.
          </div>
        </div>

        {/* Done Button */}
        <div className="modal-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
          <button type="button" className="action-btn" onClick={onClose} style={{ minWidth: '120px', padding: '10px 24px', fontWeight: '700' }}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
