import React, { useState, useEffect } from 'react';
import yearlyForecasts from '../data/yearlyForecasts-structured.json';
import activitiesLookup from '../data/activitiesLookup.json';
import ForecastCardModal from './ForecastCardModal';

const ForecastSpread = ({ birthCard, age, onForecastCardsGenerated }) => {
  const [forecastData, setForecastData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // Map the forecast data keys to display names (based on actual data structure)
  const cardMapping = {
    'Mercury': 'Mercury',
    'Venus': 'Venus', 
    'Mars': 'Mars',
    'Jupiter': 'Jupiter',
    'Saturn': 'Saturn',
    'Uranus': 'Uranus',
    'Neptune': 'Neptune',
    'PLUTO': 'Pluto',
    'LONG RANGE': 'Long Range',
    'RESULT': 'Result',
    'SUPPORT': 'Support',
    'DEVELOPMENT': 'Development'
  };

  // Convert card code from letter format (5D) to symbol format (5♦)
  const convertToSymbolFormat = (cardCode) => {
    if (!cardCode) return cardCode;
    const suitMap = {
      'D': '♦',
      'H': '♥',
      'C': '♣',
      'S': '♠'
    };
    
    const suit = cardCode.slice(-1);
    const rank = cardCode.slice(0, -1);
    
    return suitMap[suit] ? rank + suitMap[suit] : cardCode;
  };

  useEffect(() => {
    if (birthCard && age !== null) {
      // Convert the birth card to symbol format for lookup
      const symbolCardCode = convertToSymbolFormat(birthCard.card);
      const cardData = yearlyForecasts[symbolCardCode];
      
      if (cardData) {
        const ageData = cardData.find(entry => entry.AGE === age.toString());
        if (ageData) {
          setForecastData(ageData);
          // Call the callback to pass forecast cards to parent
          if (onForecastCardsGenerated) {
            onForecastCardsGenerated(ageData);
          }
        } else {
          setForecastData(null);
          if (onForecastCardsGenerated) {
            onForecastCardsGenerated(null);
          }
        }
      } else {
        setForecastData(null);
        if (onForecastCardsGenerated) {
          onForecastCardsGenerated(null);
        }
      }
    }
  }, [birthCard, age, onForecastCardsGenerated]);

  const handleCardClick = (cardKey, cardCode, displayName) => {
    const letterCode = convertToLetterFormat(cardCode);
    const activities = getCardActivities(cardCode);
    
    setSelectedCard({
      planet: displayName,
      cardCode: cardCode,
      letterCode: letterCode,
      activities: activities
    });
  };

  // Convert card code from symbol format (5♦) to letter format (5D) for activities lookup
  const convertToLetterFormat = (cardCode) => {
    if (!cardCode) return cardCode;
    const suitMap = {
      '♦': 'D',
      '♥': 'H',
      '♣': 'C',
      '♠': 'S'
    };
    
    // If already in letter format, return as-is
    if (!/[♦♥♣♠]/.test(cardCode)) return cardCode;
    
    const suit = cardCode.slice(-1);
    const rank = cardCode.slice(0, -1);
    
    return suitMap[suit] ? rank + suitMap[suit] : cardCode;
  };

  const getCardActivities = (cardCode) => {
    if (!cardCode || cardCode === 'None') return 'No specific activities for this period.';
    
    // Convert to letter format for activities lookup
    const letterCode = convertToLetterFormat(cardCode);
    const activities = activitiesLookup[letterCode];
    
    return activities || `Activities information not available for card: ${cardCode}`;
  };

  if (!forecastData) {
    return (
      <div className="card">
        <h2>📆 Yearly Forecast</h2>
        <p>Select a birth date and age to see the forecast.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📆 Yearly Forecast for Age {age}</h2>
      <p style={{marginBottom: '20px', color: '#666'}}>
        Click any card to zoom and see detailed activities & guidance
      </p>
      
      <div className="forecast-grid">
        {Object.entries(cardMapping).map(([originalKey, displayName]) => {
          const cardCode = forecastData[originalKey];
          const letterCode = convertToLetterFormat(cardCode);
          
          return (
            <div
              key={originalKey}
              className="forecast-card"
              onClick={() => handleCardClick(originalKey, cardCode, displayName)}
            >
              <div className="card-label">{displayName}</div>
              
              <div style={{marginBottom: '10px'}}>
                <strong>{cardCode}</strong>
              </div>
              
              {cardCode && cardCode !== 'None' && (
                <div className="card-image-container">
                  <img
                    src={`/cards/${letterCode}.svg`}
                    alt={cardCode}
                    className="card-image"
                    onError={(e) => {
                      console.log('Failed to load:', `/cards/png/${letterCode}.svg`);
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgODAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTIwIiByeD0iOCIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlPSIjZGRkIi8+Cjx0ZXh0IHg9IjQwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjY2Ij4nICsgY2FyZENvZGUgKyAnPC90ZXh0Pgo8L3N2Zz4=';
                      e.target.className = 'card-image card-placeholder';
                    }}
                  />
                </div>
              )}
              
              <div style={{fontSize: '12px', color: '#888', marginTop: '10px'}}>
                Click to zoom & see activities
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{marginTop: '20px', fontSize: '14px', color: '#666', fontStyle: 'italic'}}>
        💡 Each card represents different aspects of your child's year. Click them to discover specific activities and guidance.
      </div>
      
      {selectedCard && (
        <ForecastCardModal
          cardData={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default ForecastSpread;
