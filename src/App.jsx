import { useEffect, useRef, useState } from 'react';
import { buildDemoItinerary, normalizeItinerary } from './itinerary.js';

const SAMPLE_PROMPTS = [
  {
    title: 'Tokyo First-Timer',
    prompt: 'A 5-day Tokyo trip for first-time visitors who like food, design, and a few calm mornings.',
    icon: '⛩️'
  },
  {
    title: 'Lisbon Weekend',
    prompt: 'A long weekend in Lisbon for two food lovers, mixing iconic neighborhoods with relaxed evenings.',
    icon: '🍷'
  },
  {
    title: 'Iceland Road Trip',
    prompt: 'A 6-day Iceland road trip with waterfalls, scenic drives, hot springs, and easy hiking stops.',
    icon: '🌋'
  },
  {
    title: 'Mexico City Art',
    prompt: 'A romantic trip to Mexico City with good meals, art, and memorable rooftop nights.',
    icon: '🎨'
  },
  {
    title: 'Paris Solo Reset',
    prompt: 'A solo 4-day Paris trip with slow mornings, great cafes, a museum day, and an evening show.',
    icon: '🥐'
  },
  {
    title: 'NYC Culture',
    prompt: 'A 3-day New York City trip focused on art museums, a Broadway night, and great brunch spots.',
    icon: '🗽'
  }
];

export default function App() {
  const [requestText, setRequestText] = useState(SAMPLE_PROMPTS[0].prompt);
  // Default to a pre-built demo plan so the UI is rich and full from line one!
  const [plan, setPlan] = useState(() => buildDemoItinerary(SAMPLE_PROMPTS[0].prompt));
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [status, setStatus] = useState('ready');
  const [provider, setProvider] = useState('demo');
  const [model, setModel] = useState('demo');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dayFilter, setDayFilter] = useState('ALL'); // 'ALL' or day index 0..N
  const [copied, setCopied] = useState(false);

  const latestRequestId = useRef(0);
  const activeAbortController = useRef(null);
  const requestTextRef = useRef(null);

  useEffect(() => {
    return () => {
      activeAbortController.current?.abort();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    submitPrompt(requestText);
  }

  function applyPrompt(prompt) {
    setRequestText(prompt);
    setError('');
    requestTextRef.current?.focus();
    submitPrompt(prompt);
  }

  async function submitPrompt(promptText) {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setError('Describe your trip first.');
      return;
    }

    latestRequestId.current += 1;
    const requestId = latestRequestId.current;

    activeAbortController.current?.abort();
    const controller = new AbortController();
    activeAbortController.current = controller;

    setStatus('loading');
    setError('');
    setWarning('');

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestText: trimmed }),
        signal: controller.signal
      });

      if (requestId !== latestRequestId.current) {
        return;
      }

      const payload = await response.json().catch(() => null);

      if (!response.ok && !payload?.itinerary) {
        throw new Error(payload?.error || 'The planner could not build an itinerary.');
      }

      const itinerary = normalizeItinerary(payload.itinerary);

      if (requestId !== latestRequestId.current) {
        return;
      }

      setPlan(itinerary);
      setProvider(payload.source || 'api');
      setModel(payload.model || '');
      if (payload.warning) {
        setWarning(payload.warning);
      }
      setStatus('success');
    } catch (caughtError) {
      if (controller.signal.aborted || requestId !== latestRequestId.current) {
        return;
      }

      setStatus('error');
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.');
    }
  }

  function moveStop(dayId, stopId, direction) {
    setPlan((current) => {
      if (!current) return current;

      const dayIndex = current.days.findIndex((day) => day.id === dayId);
      if (dayIndex === -1) return current;

      const day = current.days[dayIndex];
      const stopIndex = day.stops.findIndex((stop) => stop.id === stopId);
      if (stopIndex === -1) return current;

      const nextIndex = stopIndex + direction;
      if (nextIndex < 0 || nextIndex >= day.stops.length) return current;

      const nextDays = current.days.map((entry, index) => {
        if (index !== dayIndex) return entry;

        const nextStops = [...entry.stops];
        [nextStops[stopIndex], nextStops[nextIndex]] = [nextStops[nextIndex], nextStops[stopIndex]];

        return { ...entry, stops: nextStops };
      });

      return { ...current, days: nextDays };
    });
  }

  function removeStop(dayId, stopId) {
    setPlan((current) => {
      if (!current) return current;

      const nextDays = current.days.map((day) => {
        if (day.id !== dayId) return day;

        return {
          ...day,
          stops: day.stops.filter((stop) => stop.id !== stopId)
        };
      });

      return { ...current, days: nextDays };
    });
  }

  function toggleDay(dayId) {
    setPlan((current) => {
      if (!current) return current;

      return {
        ...current,
        days: current.days.map((day) => {
          if (day.id !== dayId) return day;
          return { ...day, expanded: !day.expanded };
        })
      };
    });
  }

  function toggleAllDays(expand) {
    setPlan((current) => {
      if (!current) return current;
      return {
        ...current,
        days: current.days.map((day) => ({ ...day, expanded: expand }))
      };
    });
  }

  function toggleStop(dayId, stopId) {
    setPlan((current) => {
      if (!current) return current;

      return {
        ...current,
        days: current.days.map((day) => {
          if (day.id !== dayId) return day;

          return {
            ...day,
            stops: day.stops.map((stop) => {
              if (stop.id !== stopId) return stop;
              return { ...stop, expanded: !stop.expanded };
            })
          };
        })
      };
    });
  }

  function generateDocumentText() {
    if (!plan) return '';
    let doc = `# ${plan.tripTitle}\n`;
    doc += `**Destination**: ${plan.destination}\n`;
    doc += `**Duration**: ${plan.days.length} Days (${totalStops} Activities)\n`;
    doc += `**Summary**: ${plan.summary}\n\n`;
    doc += `========================================================================\n`;
    doc += `                            TRIP ITINERARY DOCUMENT                     \n`;
    doc += `========================================================================\n\n`;

    plan.days.forEach((day, i) => {
      doc += `### Day ${i + 1}: ${day.title}\n`;
      doc += `**Focus**: ${day.focus}\n`;
      doc += `**Overview**: ${day.overview}\n\n`;
      day.stops.forEach((stop, j) => {
        doc += `  ${j + 1}. ${stop.name.toUpperCase()}\n`;
        doc += `     Time: ${stop.time}\n`;
        doc += `     Category: [${stop.category}]\n`;
        doc += `     Description: ${stop.description}\n`;
        if (stop.notes) doc += `     Note: ${stop.notes}\n`;
        doc += `\n`;
      });
      doc += `------------------------------------------------------------------------\n\n`;
    });
    return doc;
  }

  function copyMarkdown() {
    if (!plan) return;
    const md = generateDocumentText();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadWordDocument() {
    if (!plan) return;

    let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${plan.tripTitle}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #0f172a; line-height: 1.6; }
    h1 { color: #1e1b4b; font-size: 24pt; margin-bottom: 4px; }
    .meta { color: #64748b; font-size: 11pt; margin-bottom: 20px; font-weight: 600; }
    .summary { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 14px 18px; margin-bottom: 24px; font-size: 11pt; color: #334155; }
    .day-header { background: #4f46e5; color: #ffffff; padding: 8px 14px; font-size: 13pt; font-weight: bold; margin-top: 24px; margin-bottom: 8px; border-radius: 4px; }
    .day-focus { color: #475569; font-style: italic; font-size: 10pt; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 10px; border: 1px solid #cbd5e1; font-size: 10pt; color: #334155; }
    td { padding: 8px 10px; border: 1px solid #cbd5e1; vertical-align: top; font-size: 10pt; }
    .badge { background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9pt; }
    .notes { color: #64748b; font-size: 9pt; margin-top: 4px; font-style: italic; }
  </style>
</head>
<body>
  <h1>${plan.tripTitle}</h1>
  <div class="meta">Destination: <strong>${plan.destination}</strong> | Duration: <strong>${plan.days.length} Days</strong> | Activities: <strong>${totalStops} Stops</strong></div>
  <div class="summary"><strong>Overview:</strong> ${plan.summary}</div>
`;

    plan.days.forEach((day, i) => {
      html += `
  <div class="day-header">Day ${i + 1}: ${day.title}</div>
  <div class="day-focus"><strong>Focus:</strong> ${day.focus} &bull; ${day.overview}</div>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Time</th>
        <th style="width: 25%;">Activity</th>
        <th style="width: 15%;">Category</th>
        <th style="width: 45%;">Details</th>
      </tr>
    </thead>
    <tbody>`;

      day.stops.forEach((stop) => {
        html += `
      <tr>
        <td><strong>${stop.time}</strong></td>
        <td><strong>${stop.name}</strong></td>
        <td><span class="badge">${stop.category}</span></td>
        <td>
          ${stop.description}
          ${stop.notes ? `<div class="notes">Note: ${stop.notes}</div>` : ''}
        </td>
      </tr>`;
      });

      html += `
    </tbody>
  </table>`;
    });

    html += `
</body>
</html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (plan.destination || 'Trip').replace(/[^a-z0-9]/gi, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `${safeName}_Itinerary.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function printDocument() {
    window.print();
  }

  // Get list of unique categories across stops
  const categories = plan
    ? ['ALL', ...new Set(plan.days.flatMap((d) => d.stops.map((s) => s.category)))]
    : ['ALL'];

  const filteredDays = plan
    ? plan.days
        .map((day, idx) => {
          if (dayFilter !== 'ALL' && dayFilter !== idx) return null;
          const stops = day.stops.filter(
            (stop) => selectedCategory === 'ALL' || stop.category === selectedCategory
          );
          return { ...day, stops };
        })
        .filter(Boolean)
    : [];

  const totalStops = plan ? plan.days.reduce((acc, d) => acc + d.stops.length, 0) : 0;

  return (
    <div className="app-shell">
      {/* Decorative ambient gradients */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="brand">
            <span className="brand-logo">✈️</span>
            <div>
              <span className="brand-name">WanderAI</span>
              <span className="brand-tag">Smart Trip Planner</span>
            </div>
          </div>

          <div className="navbar-badges">
            <span className={`provider-badge provider-${provider.includes('demo') ? 'demo' : 'api'}`}>
              <span className="status-dot" />
              {provider ? `Engine: ${provider}` : 'Engine: Demo'}
            </span>
            {model && <span className="model-badge">{model}</span>}
          </div>
        </div>
      </header>

      <main className="layout">
        {/* Banner for Auth errors / fallback mode */}
        {warning && (
          <div className="warning-banner card">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <strong>Interactive Demo Fallback Active</strong>
              <p>{warning}</p>
            </div>
          </div>
        )}

        {/* Workspace grid: Left sidebar form + Right main board */}
        <div className="workspace">
          {/* Left Column: Form & Prompts */}
          <aside className="planner-rail card">
            <div className="rail-copy">
              <span className="card-kicker">New Itinerary</span>
              <h2>Where to next?</h2>
              <p className="summary-copy">
                Type your dream destination, travel group, and vibe. The AI builds a fully editable 10-day schedule.
              </p>
            </div>

            <form className="planner-form" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <label className="field-label" htmlFor="trip-request">
                  Trip Prompt
                </label>
                <textarea
                  id="trip-request"
                  ref={requestTextRef}
                  value={requestText}
                  onChange={(event) => setRequestText(event.target.value)}
                  placeholder="e.g. 7 days in Kyoto for foodies who love ancient temples and cozy tea houses..."
                  rows={4}
                />
              </div>

              {/* Sample Prompts as sleek compact chips */}
              <div className="prompt-gallery" aria-label="Quick prompts">
                <span className="prompt-gallery-title">Inspiration Prompts</span>
                <div className="prompt-chips">
                  {SAMPLE_PROMPTS.map((samplePrompt) => (
                    <button
                      type="button"
                      key={samplePrompt.title}
                      className="chip-button"
                      onClick={() => applyPrompt(samplePrompt.prompt)}
                    >
                      <span className="chip-icon">{samplePrompt.icon}</span>
                      <span className="chip-title">{samplePrompt.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button className="primary-button" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <>
                      <span className="spinner" /> Generating Plan...
                    </>
                  ) : (
                    <>✨ Generate Itinerary</>
                  )}
                </button>
              </div>
            </form>

            <div className="status-row">
              <span className={`status-pill status-${status}`}>
                {status === 'loading' ? 'Planning...' : status === 'error' ? 'Error' : 'Ready'}
              </span>
              <span className="status-copy">
                {plan ? `${plan.days.length} Days · ${totalStops} Stops` : 'Ready to plan'}
              </span>
            </div>

            {error ? <div className="error-banner">{error}</div> : null}
          </aside>

          {/* Right Column: Interactive Board */}
          <section className="itinerary-board">
            {plan ? (
              <>
                {/* Header Card for Itinerary */}
                <div className="plan-summary card">
                  <div className="summary-main">
                    <div className="header-tags">
                      <span className="card-kicker">Destination Guide</span>
                      <span className="destination-pill">📍 {plan.destination}</span>
                    </div>
                    <h2>{plan.tripTitle}</h2>
                    <p className="summary-copy">{plan.summary}</p>
                  </div>

                  <div className="summary-footer">
                    <div className="summary-stats">
                      <div className="stat-card">
                        <span className="stat-number">{plan.days.length}</span>
                        <span className="stat-label">Days Planned</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-number">{totalStops}</span>
                        <span className="stat-label">Total Activities</span>
                      </div>
                    </div>

                    <div className="summary-actions">
                      <button
                        type="button"
                        className={`action-btn ${copied ? 'copied' : ''}`}
                        onClick={copyMarkdown}
                        title="Copy Markdown to Clipboard"
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Markdown'}
                      </button>
                      <button
                        type="button"
                        className="action-btn download-btn"
                        onClick={downloadWordDocument}
                        title="Download Microsoft Word Document (.doc)"
                      >
                        📝 Download Word Doc (.doc)
                      </button>
                      <button
                        type="button"
                        className="action-btn print-btn"
                        onClick={printDocument}
                        title="Print or Save as PDF"
                      >
                        🖨️ Print / Save PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Controls Bar: Day Filter & Expand/Collapse */}
                <div className="board-controls card">
                  <div className="filter-group">
                    <span className="filter-label">Day:</span>
                    <button
                      type="button"
                      className={`filter-chip ${dayFilter === 'ALL' ? 'active' : ''}`}
                      onClick={() => setDayFilter('ALL')}
                    >
                      All Days ({plan.days.length})
                    </button>
                    {plan.days.map((d, i) => (
                      <button
                        type="button"
                        key={d.id}
                        className={`filter-chip ${dayFilter === i ? 'active' : ''}`}
                        onClick={() => setDayFilter(i)}
                      >
                        Day {i + 1}
                      </button>
                    ))}
                  </div>

                  {categories.length > 2 && (
                    <div className="filter-group category-group">
                      <span className="filter-label">Category:</span>
                      {categories.map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="toggle-group">
                    <button type="button" className="text-btn" onClick={() => toggleAllDays(true)}>
                      Expand All
                    </button>
                    <span className="divider">·</span>
                    <button type="button" className="text-btn" onClick={() => toggleAllDays(false)}>
                      Collapse All
                    </button>
                  </div>
                </div>

                {/* Days Stack */}
                <div className="days-stack">
                  {filteredDays.map((day) => {
                    const actualDayIndex = plan.days.findIndex((d) => d.id === day.id);

                    return (
                      <article
                        className={`day-card card ${day.expanded ? 'is-open' : 'is-closed'}`}
                        key={day.id}
                      >
                        <button
                          className="day-header"
                          type="button"
                          onClick={() => toggleDay(day.id)}
                        >
                          <div className="day-title-group">
                            <span className="day-badge">Day {actualDayIndex + 1}</span>
                            <div>
                              <h3>{day.title}</h3>
                              <p className="day-focus">{day.focus}</p>
                            </div>
                          </div>

                          <div className="day-header-meta">
                            <span className="stop-count-pill">{day.stops.length} stops</span>
                            <span className="chevron-icon">{day.expanded ? '▲' : '▼'}</span>
                          </div>
                        </button>

                        {day.expanded && (
                          <div className="day-body">
                            <p className="overview-copy">{day.overview}</p>

                            {day.stops.length ? (
                              <ul className="stop-list">
                                {day.stops.map((stop, stopIndex) => (
                                  <li
                                    className={`stop-card ${stop.expanded ? 'expanded' : ''}`}
                                    key={stop.id}
                                  >
                                    <div className="stop-topline">
                                      <button
                                        className="stop-toggle"
                                        type="button"
                                        onClick={() => toggleStop(day.id, stop.id)}
                                      >
                                        <span className="stop-number">{stopIndex + 1}</span>
                                        <div className="stop-title-wrap">
                                          <strong>{stop.name}</strong>
                                          <span className="stop-time-tag">⏱️ {stop.time}</span>
                                        </div>
                                      </button>

                                      <div className="stop-meta-right">
                                        <span
                                          className={`category-badge cat-${stop.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                        >
                                          {stop.category}
                                        </span>

                                        <div className="stop-actions">
                                          <button
                                            type="button"
                                            title="Move Up"
                                            onClick={() => moveStop(day.id, stop.id, -1)}
                                            disabled={stopIndex === 0}
                                          >
                                            ↑
                                          </button>
                                          <button
                                            type="button"
                                            title="Move Down"
                                            onClick={() => moveStop(day.id, stop.id, 1)}
                                            disabled={stopIndex === day.stops.length - 1}
                                          >
                                            ↓
                                          </button>
                                          <button
                                            type="button"
                                            className="danger"
                                            title="Delete Stop"
                                            onClick={() => removeStop(day.id, stop.id)}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {stop.expanded && (
                                      <div className="stop-details">
                                        <p className="stop-desc">{stop.description}</p>
                                        {stop.notes && (
                                          <div className="stop-note-box">
                                            💡 <strong>Tip:</strong> {stop.notes}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="empty-day">
                                No stops match the current filter for this day.
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-state card">
                <span className="empty-icon">🗺️</span>
                <h2>Ready to plan your trip</h2>
                <p>Select an example prompt on the left or write your custom destination request.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
