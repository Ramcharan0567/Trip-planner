import { resolveHeroPhoto } from '../utils/helpers.jsx';

function cleanHeroSummary(summary = '') {
  if (!summary) return 'Explore curated tourist attraction places, top activities, and local cultural experiences.';
  const parts = summary.split('.').map(s => s.trim()).filter(Boolean);
  const unique = [];
  parts.forEach(p => {
    if (!unique.some(u => u.toLowerCase() === p.toLowerCase())) {
      unique.push(p);
    }
  });
  return unique.slice(0, 2).join('. ') + '.';
}

export function HeroBanner({
  plan,
  requestText,
  totalStops,
  totalCostUSD,
  formatMoney,
  currencyCode,
  onOpenShare,
  copyMarkdown,
  downloadWordDocument,
  printDocument
}) {
  if (!plan) return null;

  const heroImage = resolveHeroPhoto(plan.destination, requestText);
  const displaySummary = cleanHeroSummary(plan.summary);

  return (
    <div className="destination-hero-card">
      <img
        src={heroImage}
        alt={plan.destination}
        className="hero-image-bg"
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-top-tags">
          <span className="hero-dest-tag">📍 {plan.destination}</span>
          <span className="hero-pill-badge">🌤️ Ideal Weather</span>
          <span className="hero-pill-badge">⭐ 4.9 Top Destination</span>
          <span className="hero-pill-badge">💱 {currencyCode}</span>
        </div>

        <h2 className="hero-title">{plan.tripTitle}</h2>
        <p className="hero-summary">{displaySummary}</p>

        <div className="hero-footer-bar">
          <div className="hero-stats-group">
            <div className="hero-stat-item">
              <span className="hero-stat-value">{plan.days.length}</span>
              <span className="hero-stat-label">DAYS PLANNED</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">{totalStops}</span>
              <span className="hero-stat-label">CURATED ACTIVITIES</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">{formatMoney(totalCostUSD)}</span>
              <span className="hero-stat-label">EST. BUDGET</span>
            </div>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="action-btn"
              onClick={onOpenShare}
              style={{ background: 'var(--accent-gradient)', color: '#ffffff', border: 'none', fontWeight: '700' }}
            >
              🔗 Share Custom Trip Link
            </button>
            <button
              type="button"
              className="action-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              📋 Copy Link
            </button>
            <button type="button" className="action-btn" onClick={copyMarkdown}>
              📄 Markdown
            </button>
            <button type="button" className="action-btn" onClick={downloadWordDocument}>
              📝 Word Doc
            </button>
            <button type="button" className="action-btn" onClick={printDocument}>
              🖨️ PDF / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
