import React, { useState, useEffect } from 'react';

const WisdomVault = ({ currentReading, onLoadReading, emotionalIntent }) => {
  const [savedReadings, setSavedReadings] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [readingName, setReadingName] = useState('');

  useEffect(() => {
    // Load saved readings from localStorage
    const saved = localStorage.getItem('wisdomVault');
    if (saved) {
      setSavedReadings(JSON.parse(saved));
    }
  }, []);

  const saveReading = () => {
    if (!currentReading || !readingName.trim()) return;

    const reading = {
      id: Date.now(),
      name: readingName.trim(),
      ...currentReading,
      emotionalIntent: emotionalIntent,
      savedAt: new Date().toISOString(),
      notes: ''
    };

    const updatedReadings = [...savedReadings, reading];
    setSavedReadings(updatedReadings);
    localStorage.setItem('wisdomVault', JSON.stringify(updatedReadings));
    
    setReadingName('');
    setShowSaveDialog(false);
  };

  const deleteReading = (id) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      const updatedReadings = savedReadings.filter(r => r.id !== id);
      setSavedReadings(updatedReadings);
      localStorage.setItem('wisdomVault', JSON.stringify(updatedReadings));
    }
  };

  const loadReading = (reading) => {
    if (onLoadReading) {
      onLoadReading(reading);
    }
  };

  const addNote = (id, note) => {
    const updatedReadings = savedReadings.map(r => 
      r.id === id ? { ...r, notes: note } : r
    );
    setSavedReadings(updatedReadings);
    localStorage.setItem('wisdomVault', JSON.stringify(updatedReadings));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="wisdom-vault">
      <div className="vault-header">
        <h3>🗂️ Wisdom Vault</h3>
        <p>Save and revisit your child's readings</p>
        
        {currentReading && (
          <button 
            className="save-current-btn"
            onClick={() => setShowSaveDialog(true)}
          >
            💾 Save Current Reading
          </button>
        )}
      </div>

      {showSaveDialog && (
        <div className="save-dialog">
          <h4>Save Reading</h4>
          <input
            type="text"
            value={readingName}
            onChange={(e) => setReadingName(e.target.value)}
            placeholder="Enter a name for this reading..."
            className="reading-name-input"
          />
          <div className="dialog-buttons">
            <button onClick={saveReading} disabled={!readingName.trim()}>
              Save
            </button>
            <button onClick={() => setShowSaveDialog(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="saved-readings">
        {savedReadings.length === 0 ? (
          <div className="empty-vault">
            <p>No saved readings yet.</p>
            <p>Complete a reading above and save it to start building your wisdom vault!</p>
          </div>
        ) : (
          savedReadings.map((reading) => (
            <div key={reading.id} className="saved-reading">
              <div className="reading-header">
                <h4>{reading.name}</h4>
                <div className="reading-meta">
                  <span className="reading-date">{formatDate(reading.savedAt)}</span>
                  <span className="reading-age">Age {reading.age}</span>
                </div>
              </div>

              <div className="reading-summary">
                <div className="birth-card-summary">
                  <strong>Birth Card:</strong> {reading.birthCard?.cardName}
                </div>
                {reading.emotionalIntent && (
                  <div className="intent-summary">
                    <strong>Intent:</strong> <span className="intent-tag">{reading.emotionalIntent}</span>
                  </div>
                )}
                {reading.forecastCards && (
                  <div className="forecast-summary">
                    <strong>Key Cards:</strong> 
                    <span className="card-codes">
                      {Object.entries(reading.forecastCards)
                        .slice(0, 4)
                        .map(([planet, card]) => `${planet}: ${card}`)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="reading-notes">
                <textarea
                  value={reading.notes || ''}
                  onChange={(e) => addNote(reading.id, e.target.value)}
                  placeholder="Add personal notes about this reading..."
                  className="notes-input"
                  rows="2"
                />
              </div>

              <div className="reading-actions">
                <button 
                  onClick={() => loadReading(reading)}
                  className="load-btn"
                >
                  📖 Load Reading
                </button>
                <button 
                  onClick={() => deleteReading(reading.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="vault-stats">
        <div className="stat">
          <span className="stat-number">{savedReadings.length}</span>
          <span className="stat-label">Saved Readings</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {savedReadings.filter(r => r.notes && r.notes.trim()).length}
          </span>
          <span className="stat-label">With Notes</span>
        </div>
      </div>
    </div>
  );
};

export default WisdomVault;
