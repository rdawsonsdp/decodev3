import React from 'react';

const ForecastCardModal = ({ cardData, onClose }) => {
  if (!cardData) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="forecast-card-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="forecast-card-content">
          <div className="forecast-card-header">
            <h3>{cardData.planet}</h3>
            <div className="forecast-card-code">
              <strong>{cardData.cardCode}</strong>
            </div>
          </div>

          {cardData.cardCode && cardData.cardCode !== 'None' && (
            <div className="forecast-card-image-container">
              <img
                src={`/cards/${cardData.letterCode}.svg`}
                alt={cardData.cardCode}
                className="forecast-card-large-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="forecast-card-activities">
            <h4>🎯 Activities & Guidance</h4>
            <div className="activities-content">
              {cardData.activities.split('\n').map((line, index) => {
                if (line.trim() === '') return null;
                
                // Check if line starts with bullet point or number
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                const isNumbered = /^\d+\./.test(line.trim());
                const isHeader = line.includes(':') && !isBullet && !isNumbered && line.length < 100;
                
                return (
                  <div 
                    key={index} 
                    className={`activity-line ${isHeader ? 'activity-header' : ''} ${isBullet || isNumbered ? 'activity-bullet' : ''}`}
                  >
                    {line.trim()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastCardModal;
