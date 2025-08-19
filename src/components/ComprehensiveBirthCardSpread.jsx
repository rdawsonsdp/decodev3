import React, { useState, useEffect } from 'react';
import { getBirthCardFromDate } from '../utils/getBirthCardFromDate';
import { getCardImage } from '../utils/getCardImage';
import { getCardProfile } from '../utils/getCardProfile';
import { CardModal } from './CardModal';
import GPTChat from './GPTChat';
import yearlyForecasts from '../data/yearlyForecasts-structured.json';
import activitiesLookup from '../data/activitiesLookup.json';

export function ComprehensiveBirthCardSpread({ name, birthdate, initialAge }) {
  const [age, setAge] = useState(initialAge);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState('');
  const [selectedCardDescription, setSelectedCardDescription] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState('');

  // Get birth card info
  const birthCard = getBirthCardFromDate(birthdate);
  const birthCardProfile = getCardProfile(birthCard.card);

  // Calculate current date and planetary periods
  const today = new Date();
  const currentDate = `${today.getMonth() + 1}/${today.getDate()}`;

  // Convert card format from letters (4D) to symbols (4♦)
  const convertCardFormat = (card) => {
    if (!card) return card;
    return card.replace('D', '♦').replace('H', '♥').replace('C', '♣').replace('S', '♠');
  };

  // Get forecast data for current age
  const getForecastForAge = (card, targetAge) => {
    const symbolCard = convertCardFormat(card);
    const cardForecasts = yearlyForecasts[symbolCard];
    if (!cardForecasts) return null;
    
    return cardForecasts.find(forecast => parseInt(forecast.AGE) === targetAge);
  };

  const currentForecast = getForecastForAge(birthCard.card, age);

  // Planetary period mapping
  const planetaryPeriods = [
    { name: 'Mercury', field: 'Communcations', startDate: '1/1' },
    { name: 'Venus', field: 'Culture & Client Experience', startDate: '2/22' },
    { name: 'Mars', field: 'Operations & Executions', startDate: '4/15' },
    { name: 'Jupiter', field: 'Business Development', startDate: '6/6' },
    { name: 'Saturn', field: 'Legal, Finance & Infrastructure', startDate: '7/28' },
    { name: 'Uranus', field: 'Innovation,   R& D', startDate: '9/18' },
    { name: 'Neptune', field: 'Vision & Purpose', startDate: '11/9' }
  ];

  // Yearly birth card spread cards
  const yearlySpreadCards = [
    { title: 'Birth Card', field: 'BIRTH_CARD', card: birthCard.card },
    { title: 'LR', field: 'LONG RANGE', card: currentForecast?.['LONG RANGE'] },
    { title: 'Pluto', field: 'TRANSFORMATION', card: currentForecast?.['TRANSFORMATION'] },
    { title: 'Result', field: 'RESULT', card: currentForecast?.['RESULT'] },
    { title: 'Support', field: 'SUPPORT', card: currentForecast?.['SUPPORT'] },
    { title: 'Development', field: 'DEVELOPMENT', card: currentForecast?.['DEVELOPMENT'] }
  ];

  // Get current planetary period
  const getCurrentPlanetaryPeriod = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    for (let i = planetaryPeriods.length - 1; i >= 0; i--) {
      const [month, day] = planetaryPeriods[i].startDate.split('/').map(Number);
      if (currentMonth > month || (currentMonth === month && currentDay >= day)) {
        return planetaryPeriods[i].name;
      }
    }
    return 'Neptune'; // Default to last period if before first
  };

  const currentPlanetaryPeriod = getCurrentPlanetaryPeriod();

  const handleCardClick = (card, cardName, isProfileCard = false) => {
    if (!card || card === 'None') return;
    
    if (isProfileCard) {
      // Show birth card profile
      const profile = getCardProfile(card);
      if (profile) {
        setSelectedCard(card);
        setSelectedCardName(cardName);
        setSelectedCardDescription(profile.Description);
        setModalImageUrl(getCardImage(card));
      }
    } else {
      // Show activities from Card to Activities file
      const activities = activitiesLookup[card];
      if (activities) {
        setSelectedCard(card);
        setSelectedCardName(cardName);
        setSelectedCardDescription(activities.activities || 'No activities available for this card.');
        setModalImageUrl(getCardImage(card));
      }
    }
  };

  const formatCardName = (card) => {
    if (!card || card === 'None') return 'None';
    const cardMap = {
      'A': 'Ace', 'J': 'Jack', 'Q': 'Queen', 'K': 'King',
      '♠': 'Spades', '♥': 'Hearts', '♦': 'Diamonds', '♣': 'Clubs'
    };
    
    let formatted = card;
    Object.keys(cardMap).forEach(key => {
      formatted = formatted.replace(key, cardMap[key]);
    });
    return formatted;
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#D4EDFF', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Person Info Header */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
        <h2 style={{ color: '#13293D', marginBottom: '10px' }}>{name}</h2>
        <p style={{ color: '#134A7C', marginBottom: '5px' }}>Date of Birth: {birthdate}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ color: '#134A7C' }}>Age:</span>
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(parseInt(e.target.value))}
            style={{ 
              padding: '5px 10px', 
              border: '2px solid #FFD57E', 
              borderRadius: '5px',
              fontSize: '16px',
              width: '80px'
            }}
          />
        </div>
      </div>

      {/* Yearly Birth Card Spread */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          color: '#13293D', 
          marginBottom: '20px', 
          fontSize: '24px',
          textAlign: 'center' 
        }}>
          Yearly Birth Card Spread
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {yearlySpreadCards.map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <h4 style={{ 
                color: '#134A7C', 
                marginBottom: '10px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {item.title}
              </h4>
              <div 
                onClick={() => handleCardClick(
                  item.card, 
                  formatCardName(item.card),
                  item.title === 'Birth Card'
                )}
                style={{ 
                  cursor: item.card && item.card !== 'None' ? 'pointer' : 'default',
                  opacity: item.card && item.card !== 'None' ? 1 : 0.5
                }}
              >
                <img 
                  src={item.card && item.card !== 'None' ? getCardImage(item.card) : '/cards/Joker.svg'} 
                  alt={item.card || 'None'} 
                  style={{ 
                    width: '100px', 
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planetary Periods */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          color: '#13293D', 
          marginBottom: '20px', 
          fontSize: '24px',
          textAlign: 'center' 
        }}>
          Cards Ruling Each 52-day Planetary Period
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '15px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {planetaryPeriods.map((period, index) => {
            const periodCard = currentForecast?.[period.field];
            const isCurrentPeriod = period.name === currentPlanetaryPeriod;
            
            return (
              <div 
                key={index} 
                style={{ 
                  textAlign: 'center',
                  padding: '15px',
                  backgroundColor: isCurrentPeriod ? '#FFF9E5' : 'white',
                  borderRadius: '10px',
                  border: isCurrentPeriod ? '3px solid #FFD57E' : '1px solid #e0e0e0',
                  boxShadow: isCurrentPeriod ? '0 6px 12px rgba(255, 213, 126, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h4 style={{ 
                  color: '#134A7C', 
                  marginBottom: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {period.name}
                </h4>
                <p style={{ 
                  color: '#666', 
                  fontSize: '12px',
                  marginBottom: '10px'
                }}>
                  {period.startDate}
                </p>
                <div 
                  onClick={() => handleCardClick(periodCard, formatCardName(periodCard))}
                  style={{ 
                    cursor: periodCard && periodCard !== 'None' ? 'pointer' : 'default',
                    opacity: periodCard && periodCard !== 'None' ? 1 : 0.5
                  }}
                >
                  <img 
                    src={periodCard && periodCard !== 'None' ? getCardImage(periodCard) : '/cards/Joker.svg'} 
                    alt={periodCard || 'None'} 
                    style={{ 
                      width: '80px', 
                      height: 'auto',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPT Chat */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <GPTChat />
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          cardName={selectedCardName}
          description={selectedCardDescription}
          imageUrl={modalImageUrl}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
