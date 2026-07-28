export function BookingModal({
  bookingItem,
  setBookingItem,
  bookingStep,
  setBookingStep,
  travellerName,
  setTravellerName,
  travellerEmail,
  setTravellerEmail,
  travellerPhone,
  setTravellerPhone,
  travellerAge,
  setTravellerAge,
  seatPref,
  setSeatPref,
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  confirmedBooking,
  onProcessPayment,
  formatMoney,
  showToast
}) {
  if (!bookingItem) return null;

  return (
    <div className="modal-backdrop" onClick={() => setBookingItem(null)}>
      <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
            <span>💳</span> Instant Reservation & Checkout
          </h3>
          <button
            type="button"
            onClick={() => setBookingItem(null)}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Selected Item Summary */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase' }}>Selected Service</span>
            <h4 style={{ margin: '2px 0 0 0', fontSize: '1rem', color: '#1e3a8a' }}>{bookingItem.title || bookingItem.carrier}</h4>
            <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>{bookingItem.code || bookingItem.type} · {bookingItem.class || bookingItem.loc}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Payable</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1d4ed8' }}>{formatMoney(bookingItem.priceUSD)}</div>
          </div>
        </div>

        {bookingStep === 'details' && (
          <form onSubmit={(e) => { e.preventDefault(); setBookingStep('payment'); }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Passenger & Contact Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="field-label">Traveller Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={travellerName}
                    onChange={(e) => setTravellerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Age</label>
                  <input
                    type="number"
                    className="input-field"
                    value={travellerAge}
                    onChange={(e) => setTravellerAge(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Email Address (E-Ticket Recipient)</label>
                <input
                  type="email"
                  className="input-field"
                  value={travellerEmail}
                  onChange={(e) => setTravellerEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="field-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={travellerPhone}
                    onChange={(e) => setTravellerPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Seat / Room Preference</label>
                  <select
                    className="input-field"
                    value={seatPref}
                    onChange={(e) => setSeatPref(e.target.value)}
                  >
                    <option>Window Seat</option>
                    <option>Aisle Seat</option>
                    <option>Lower Berth / Ground Floor</option>
                    <option>Upper Floor High View</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="action-btn" onClick={() => setBookingItem(null)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" style={{ width: 'auto' }}>
                Proceed to Payment →
              </button>
            </div>
          </form>
        )}

        {bookingStep === 'payment' && (
          <>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Select Payment Method</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                className={`filter-chip ${paymentMethod === 'upi' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px' }}
                onClick={() => setPaymentMethod('upi')}
              >
                📲 UPI (GPay/PhonePe)
              </button>
              <button
                type="button"
                className={`filter-chip ${paymentMethod === 'card' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px' }}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Credit / Debit Card
              </button>
              <button
                type="button"
                className={`filter-chip ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px' }}
                onClick={() => setPaymentMethod('netbanking')}
              >
                🏦 Net Banking
              </button>
            </div>

            <form onSubmit={onProcessPayment}>
              {paymentMethod === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label className="field-label">VPA / UPI ID (Google Pay / PhonePe / Paytm)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed var(--card-border)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>📲</div>
                    <strong style={{ fontSize: '0.88rem' }}>Scan QR Code or Approve Request on GPay / PhonePe</strong>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label className="field-label">Card Number</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="4532 8912 3456 7890"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="field-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">CVV / CVC</label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div style={{ marginBottom: '16px' }}>
                  <label className="field-label">Select Bank</label>
                  <select className="input-field">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="action-btn" onClick={() => setBookingStep('details')}>
                  ← Back
                </button>
                <button type="submit" className="primary-button" style={{ width: 'auto', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
                  🔒 Pay {formatMoney(bookingItem.priceUSD)} Now
                </button>
              </div>
            </form>
          </>
        )}

        {bookingStep === 'success' && confirmedBooking && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3 style={{ margin: 0, color: '#059669' }}>Booking & Payment Confirmed!</h3>
            <p className="summary-copy">Your e-ticket has been sent to <strong>{confirmedBooking.traveller.email}</strong></p>

            <div style={{ background: '#f8fafc', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>PNR NUMBER</span>
                <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>{confirmedBooking.pnr}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passenger:</span>
                <strong>{confirmedBooking.traveller.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Service:</span>
                <strong>{confirmedBooking.item.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payment Mode:</span>
                <strong>{confirmedBooking.payment.method} ({confirmedBooking.payment.amount})</strong>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setBookingItem(null);
                showToast('📄 E-Ticket downloaded successfully!');
              }}
            >
              📥 Download E-Ticket & Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
