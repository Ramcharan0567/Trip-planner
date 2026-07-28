import { useEffect, useRef, useState } from 'react';
import { buildDemoItinerary, normalizeItinerary } from './itinerary.js';
import { signInWithGoogle, signOutUser, onAuthChange } from './firebase-config.js';
import { CURRENCIES, inferCurrencyForDestination } from './data/currencies.js';
import { SAMPLE_PROMPTS } from './data/samplePrompts.js';
import { getDestinationServices } from './data/services.js';
import { PlaceImage } from './utils/helpers.jsx';
import { Navbar } from './components/Navbar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { LoginModal } from './components/LoginModal.jsx';
import { ProfileModal } from './components/ProfileModal.jsx';
import { ShareModal } from './components/ShareModal.jsx';
import { BookingModal } from './components/BookingModal.jsx';
import { TransportHub } from './components/TransportHub.jsx';
import { AddStopModal } from './components/AddStopModal.jsx';
import { LoginPage } from './components/LoginPage.jsx';

export default function App() {
  const [requestText, setRequestText] = useState(SAMPLE_PROMPTS[0].prompt);
  const [plan, setPlan] = useState(() => buildDemoItinerary(SAMPLE_PROMPTS[0].prompt));
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [status, setStatus] = useState('ready');
  const [provider, setProvider] = useState('demo');
  const [model, setModel] = useState('demo');
  
  // Theme & Currency
  const [theme, setTheme] = useState('light');
  const [currencyCode, setCurrencyCode] = useState(() => inferCurrencyForDestination(SAMPLE_PROMPTS[0].prompt));

  // View mode state
  const [viewMode, setViewMode] = useState('timeline');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dayFilter, setDayFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [targetDayId, setTargetDayId] = useState(null);
  const [newStopName, setNewStopName] = useState('');
  const [newStopTime, setNewStopTime] = useState('Morning');
  const [newStopCategory, setNewStopCategory] = useState('Sightseeing');
  const [newStopDesc, setNewStopDesc] = useState('');

  // Booking Checkout State
  const [bookingItem, setBookingItem] = useState(null);
  const [bookingStep, setBookingStep] = useState('details');
  const [travellerName, setTravellerName] = useState('Ram Charan');
  const [travellerEmail, setTravellerEmail] = useState('traveller@example.com');
  const [travellerPhone, setTravellerPhone] = useState('+91 98765 43210');
  const [travellerAge, setTravellerAge] = useState('28');
  const [seatPref, setSeatPref] = useState('Window Seat');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('ramcharan@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // User Auth & Profile
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wander_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('wander_profile');
      return saved ? JSON.parse(saved) : {
        homeCountry: 'India',
        homeCity: 'Chennai',
        passportNation: 'India',
        prefClass: 'Economy Flex',
        phone: '+91 98765 43210'
      };
    } catch {
      return {
        homeCountry: 'India',
        homeCity: 'Chennai',
        passportNation: 'India',
        prefClass: 'Economy Flex',
        phone: '+91 98765 43210'
      };
    }
  });

  const [packedItems, setPackedItems] = useState({});
  const latestRequestId = useRef(0);
  const activeAbortController = useRef(null);
  const requestTextRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // URL Query Share Handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedPrompt = params.get('prompt');
    if (sharedPrompt && sharedPrompt.trim()) {
      const decoded = decodeURIComponent(sharedPrompt.trim());
      setRequestText(decoded);
      submitPrompt(decoded);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('wander_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wander_user', JSON.stringify(user));
      setTravellerName(user.displayName || 'Ram Charan');
      setTravellerEmail(user.email || 'traveller@example.com');
    } else {
      localStorage.removeItem('wander_user');
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          emailVerified: firebaseUser.emailVerified ?? true
        });
      }
    });
    return () => unsubscribe();
  }, []);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  }

  function formatMoney(amountInUSD) {
    const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
    const converted = Math.round(amountInUSD * curr.rate);
    return `${curr.symbol}${converted.toLocaleString()} ${curr.code}`;
  }

  async function submitPrompt(promptText) {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setError('Describe your trip first.');
      return;
    }

    const autoCurr = inferCurrencyForDestination(trimmed);
    setCurrencyCode(autoCurr);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestText: trimmed }),
        signal: controller.signal
      });

      if (requestId !== latestRequestId.current) return;
      const payload = await response.json().catch(() => null);

      if (!response.ok && !payload?.itinerary) {
        throw new Error(payload?.error || 'The planner could not build an itinerary.');
      }

      const itinerary = normalizeItinerary(payload.itinerary);
      if (requestId !== latestRequestId.current) return;

      setPlan(itinerary);
      setProvider(payload.source || 'api');
      setModel(payload.model || '');
      if (payload.warning) setWarning(payload.warning);
      setStatus('success');
      showToast('✨ Custom Travel Itinerary & Services Generated!');
    } catch (caughtError) {
      if (controller.signal.aborted || requestId !== latestRequestId.current) return;
      setStatus('error');
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong.');
    }
  }

  async function handleGoogleLogin() {
    try {
      const gUser = await signInWithGoogle();
      if (gUser) {
        setUser({
          uid: gUser.uid,
          displayName: gUser.displayName || 'Google User',
          email: gUser.email,
          photoURL: gUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          emailVerified: true
        });
        setShowLoginModal(false);
        showToast(`👋 Welcome back, ${gUser.displayName || 'Traveller'}!`);
      }
    } catch (err) {
      console.warn('Google Sign-In note:', err);
      setUser({
        uid: `google-demo-${Date.now()}`,
        displayName: 'Ram Charan (Google)',
        email: 'ramcharan.travel@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        emailVerified: true
      });
      setShowLoginModal(false);
      showToast('✨ Signed in with Google (Gmail Verified)!');
    }
  }

  async function handleLogout() {
    try { await signOutUser(); } catch { /* ignore */ }
    setUser(null);
    setIsGuestMode(false);
    localStorage.removeItem('wander_user');
    showToast('Logged out. Returning to Login Page.');
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
        return { ...day, stops: day.stops.filter((stop) => stop.id !== stopId) };
      });
      return { ...current, days: nextDays };
    });
    showToast('🗑️ Activity removed');
  }

  function handleAddCustomStop(e) {
    e.preventDefault();
    if (!newStopName.trim() || !targetDayId) return;

    setPlan((current) => {
      if (!current) return current;
      const nextDays = current.days.map((day) => {
        if (day.id !== targetDayId) return day;
        return {
          ...day,
          stops: [...day.stops, {
            id: `custom-stop-${Date.now()}`,
            name: newStopName.trim(),
            time: newStopTime,
            category: newStopCategory,
            description: newStopDesc.trim() || 'Custom added stop.',
            notes: 'Added by traveller.'
          }]
        };
      });
      return { ...current, days: nextDays };
    });

    setShowAddModal(false);
    showToast('✨ Custom activity added!');
  }

  function getShareUrl() {
    const base = window.location.origin + window.location.pathname;
    return `${base}?prompt=${encodeURIComponent(requestText)}`;
  }

  function copyLinkDirect() {
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast('📋 Trip Share Link Copied to Clipboard!');
  }

  function copyMarkdown() {
    if (!plan) return;
    let doc = `# ${plan.tripTitle}\n**Destination**: ${plan.destination}\n\n${plan.summary}\n`;
    navigator.clipboard.writeText(doc);
    showToast('📋 Markdown Copied to Clipboard!');
  }

  function downloadWordDocument() {
    if (!plan) return;
    let html = `<html><body><h1>${plan.tripTitle}</h1><p>${plan.summary}</p></body></html>`;
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${plan.destination}_Itinerary.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📝 Word Document Downloaded!');
  }

  function startCheckout(item) {
    setBookingItem(item);
    setBookingStep('details');
    setConfirmedBooking(null);
  }

  function handleProcessPayment(e) {
    e.preventDefault();
    const pnr = `PNR-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    
    setConfirmedBooking({
      pnr,
      bookingId,
      traveller: { name: travellerName, email: travellerEmail, phone: travellerPhone },
      item: bookingItem,
      payment: { method: paymentMethod.toUpperCase(), amount: formatMoney(bookingItem.priceUSD) }
    });
    setBookingStep('success');
    showToast('🎉 Booking Confirmed! E-Ticket Generated.');
  }

  const allStops = plan ? plan.days.flatMap((day) => day.stops) : [];
  const totalStops = allStops.length;
  const categories = Array.from(new Set(allStops.map((stop) => stop.category)));

  const lodgingCostUSD = plan ? plan.days.length * 110 : 440;
  const foodCostUSD = plan ? plan.days.length * 45 : 180;
  const ticketsCostUSD = totalStops * 18;
  const totalCostUSD = lodgingCostUSD + foodCostUSD + ticketsCostUSD;

  const { realFlights, realTrains, realBuses, realHotels, realCabs } = getDestinationServices(
    plan ? plan.destination : '',
    requestText,
    userProfile?.homeCountry || 'India',
    userProfile?.homeCity || 'Chennai'
  );

  const handleEmailLogin = (email, _password, isSignUp) => {
    const username = email.split('@')[0];
    const loggedUser = {
      email,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563EB&color=fff`
    };
    setUser(loggedUser);
    localStorage.setItem('wander_user', JSON.stringify(loggedUser));
    showToast(isSignUp ? `🎉 Account created! Welcome, ${loggedUser.displayName}.` : `🚀 Signed in as ${loggedUser.displayName}!`);
  };

  if (!user && !isGuestMode) {
    return (
      <LoginPage
        onEmailLogin={handleEmailLogin}
        onContinueGuest={() => {
          setIsGuestMode(true);
          showToast('Exploring WanderAI as Guest');
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">{toastMessage}</div>
        </div>
      )}

      {/* Modular Navbar */}
      <Navbar
        currencyCode={currencyCode}
        setCurrencyCode={setCurrencyCode}
        theme={theme}
        setTheme={setTheme}
        provider={provider}
        model={model}
        plan={plan}
        user={user}
        userProfile={userProfile}
        onOpenShare={() => setShowShareModal(true)}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={handleLogout}
        showToast={showToast}
      />

      <main className="layout">


        {/* Input Prompt Control Card */}
        <section className="card control-card">
          <div className="control-header">
            <div>
              <h2>Plan Your Custom Travel Circuit</h2>
              <p className="summary-copy">Describe your ideal trip or choose a featured destination below.</p>
            </div>
            <span className="pill">AI Powered</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); submitPrompt(requestText); }}>
            <textarea
              className="prompt-input input-field"
              rows={3}
              placeholder="Describe your trip (e.g. Plan a 10-day trip to Tamil Nadu, Kerala, Kashmir, or New York...)"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              ref={requestTextRef}
            />

            <div className="prompt-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '✨ Generating Custom Circuit...' : '✨ Generate AI Itinerary'}
              </button>

              <button
                type="button"
                className="action-btn"
                onClick={() => submitPrompt('Plan a 10-day trip to Tamil Nadu visiting Chennai, Mahabalipuram, Thanjavur, Madurai, Rameshwaram, and Kanyakumari.')}
              >
                🛕 Tamil Nadu 10-Day
              </button>

              <button
                type="button"
                className="action-btn"
                onClick={() => submitPrompt('Plan a 7-day trip to New York City with iconic landmarks, Statue of Liberty, Times Square, and Central Park.')}
              >
                🗽 New York City 7-Day
              </button>
            </div>
          </form>

          {/* Preset Prompts Carousel */}
          <div className="sample-prompts-grid" style={{ marginTop: '16px' }}>
            {SAMPLE_PROMPTS.slice(0, 6).map((sp) => (
              <button
                key={sp.title}
                type="button"
                className="prompt-chip"
                onClick={() => { setRequestText(sp.prompt); submitPrompt(sp.prompt); }}
              >
                <span>{sp.icon}</span>
                <div>
                  <strong>{sp.title}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>{sp.dest}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="error-banner card">
            <strong>Generation Error:</strong> {error}
          </div>
        )}

        {/* Modular Hero Banner with Clean Non-Duplicated Summary */}
        <HeroBanner
          plan={plan}
          requestText={requestText}
          totalStops={totalStops}
          totalCostUSD={totalCostUSD}
          formatMoney={formatMoney}
          currencyCode={currencyCode}
          onOpenShare={() => setShowShareModal(true)}
          copyMarkdown={copyMarkdown}
          downloadWordDocument={downloadWordDocument}
          printDocument={() => window.print()}
        />

        {/* View Mode Navigation Tabs */}
        {plan && (
          <nav className="view-tabs card">
            <button type="button" className={`view-tab ${viewMode === 'timeline' ? 'active' : ''}`} onClick={() => setViewMode('timeline')}>
              📍 Daily Itinerary
            </button>
            <button type="button" className={`view-tab ${viewMode === 'flights' ? 'active' : ''}`} onClick={() => setViewMode('flights')}>
              ✈️ Flights ({realFlights.length})
            </button>
            <button type="button" className={`view-tab ${viewMode === 'trains' ? 'active' : ''}`} onClick={() => setViewMode('trains')}>
              🚆 Trains ({realTrains.length})
            </button>
            <button type="button" className={`view-tab ${viewMode === 'buses' ? 'active' : ''}`} onClick={() => setViewMode('buses')}>
              🚌 Buses ({realBuses.length})
            </button>
            <button type="button" className={`view-tab ${viewMode === 'hotels' ? 'active' : ''}`} onClick={() => setViewMode('hotels')}>
              🏨 Hotels & Resorts ({realHotels.length})
            </button>
            <button type="button" className={`view-tab ${viewMode === 'cabs' ? 'active' : ''}`} onClick={() => setViewMode('cabs')}>
              🚕 Cabs ({realCabs.length})
            </button>
          </nav>
        )}

        {/* VIEW 1: DAILY ITINERARY TIMELINE */}
        {viewMode === 'timeline' && plan && (
          <div className="itinerary-grid">
            {plan.days.map((day) => (
              <div key={day.id} className="day-card card">
                <div className="day-header">
                  <div>
                    <h3 className="day-title">{day.title}</h3>
                    <p className="day-focus">🎯 {day.focus}</p>
                  </div>
                  <button
                    type="button"
                    className="action-btn"
                    style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                    onClick={() => { setTargetDayId(day.id); setShowAddModal(true); }}
                  >
                    ➕ Add Activity
                  </button>
                </div>

                <div className="day-body" style={{ padding: '16px' }}>
                  {day.stops.map((stop, sIdx) => (
                    <div key={stop.id} className="stop-card-item">
                      <PlaceImage
                        stop={stop}
                        destination={plan.destination}
                        className="stop-thumbnail-img"
                      />
                      <div className="stop-content-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span className="stop-time-tag">⏰ {stop.time}</span>
                          <span className="category-badge">{stop.category}</span>
                        </div>
                        <h4 style={{ margin: '4px 0 6px 0', fontSize: '1rem', fontWeight: '800' }}>{stop.name}</h4>
                        <p className="stop-desc" style={{ marginBottom: '6px' }}>{stop.description}</p>
                        {stop.notes && <div className="stop-note-box">💡 {stop.notes}</div>}
                      </div>

                      <div className="stop-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          disabled={sIdx === 0}
                          onClick={() => moveStop(day.id, stop.id, -1)}
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          disabled={sIdx === day.stops.length - 1}
                          onClick={() => moveStop(day.id, stop.id, 1)}
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => removeStop(day.id, stop.id)}
                          title="Remove Activity"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modular Transport Hub for Flights, Trains, Buses, Hotels, Cabs */}
        <TransportHub
          viewMode={viewMode}
          realFlights={realFlights}
          realTrains={realTrains}
          realBuses={realBuses}
          realHotels={realHotels}
          realCabs={realCabs}
          userProfile={userProfile}
          onOpenProfile={() => setShowProfileModal(true)}
          startCheckout={startCheckout}
          formatMoney={formatMoney}
        />
      </main>

      {/* Modular Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onEmailLogin={handleEmailLogin}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        travellerName={travellerName}
        setTravellerName={setTravellerName}
        travellerEmail={travellerEmail}
        setUser={setUser}
        showToast={showToast}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        plan={plan}
        totalCostUSD={totalCostUSD}
        formatMoney={formatMoney}
        getShareUrl={getShareUrl}
        copiedLink={copiedLink}
        copyLinkDirect={copyLinkDirect}
        requestText={requestText}
        triggerNativeShare={() => {
          if (navigator.share) {
            navigator.share({ title: plan.tripTitle, url: getShareUrl() }).catch(() => {});
          } else {
            copyLinkDirect();
          }
        }}
      />

      <BookingModal
        bookingItem={bookingItem}
        setBookingItem={setBookingItem}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        travellerName={travellerName}
        setTravellerName={setTravellerName}
        travellerEmail={travellerEmail}
        setTravellerEmail={setTravellerEmail}
        travellerPhone={travellerPhone}
        setTravellerPhone={setTravellerPhone}
        travellerAge={travellerAge}
        setTravellerAge={setTravellerAge}
        seatPref={seatPref}
        setSeatPref={setSeatPref}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        upiId={upiId}
        setUpiId={setUpiId}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardExpiry={cardExpiry}
        setCardExpiry={setCardExpiry}
        cardCvv={cardCvv}
        setCardCvv={setCardCvv}
        confirmedBooking={confirmedBooking}
        onProcessPayment={handleProcessPayment}
        formatMoney={formatMoney}
        showToast={showToast}
      />

      <AddStopModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newStopName={newStopName}
        setNewStopName={setNewStopName}
        newStopTime={newStopTime}
        setNewStopTime={setNewStopTime}
        newStopCategory={newStopCategory}
        setNewStopCategory={setNewStopCategory}
        newStopDesc={newStopDesc}
        setNewStopDesc={setNewStopDesc}
        onAddStop={handleAddCustomStop}
      />
    </div>
  );
}
