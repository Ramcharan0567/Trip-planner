export function AddStopModal({
  isOpen,
  onClose,
  newStopName,
  setNewStopName,
  newStopTime,
  setNewStopTime,
  newStopCategory,
  setNewStopCategory,
  newStopDesc,
  setNewStopDesc,
  onAddStop
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>➕ Add Custom Attraction / Activity</h3>
        <form onSubmit={onAddStop}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="field-label">Place / Attraction Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Marina Beach Sunset Walk"
                value={newStopName}
                onChange={(e) => setNewStopName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="field-label">Time of Day</label>
                <select
                  className="input-field"
                  value={newStopTime}
                  onChange={(e) => setNewStopTime(e.target.value)}
                >
                  <option>08:00 AM</option>
                  <option>10:00 AM</option>
                  <option>01:00 PM</option>
                  <option>03:30 PM</option>
                  <option>06:00 PM</option>
                  <option>08:00 PM</option>
                </select>
              </div>

              <div>
                <label className="field-label">Category</label>
                <select
                  className="input-field"
                  value={newStopCategory}
                  onChange={(e) => setNewStopCategory(e.target.value)}
                >
                  <option>Sightseeing</option>
                  <option>Culture</option>
                  <option>Heritage</option>
                  <option>Dining & Food</option>
                  <option>Nature & Outdoor</option>
                  <option>Shopping</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Activity Description</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="What to see and explore here..."
                value={newStopDesc}
                onChange={(e) => setNewStopDesc(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="action-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" style={{ width: 'auto' }}>
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
