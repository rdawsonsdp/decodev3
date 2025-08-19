import React, { useState, useEffect } from 'react';
import { getBirthCardFromDate, calculateCorrectAge, parseBirthdate } from '../utils/correctBirthCardLookup';
import { getYearlyForecast, getYearlySpreadCards, getPlanetaryPeriods } from '../utils/yearlyForecastLookup';
import { getCardImage } from '../utils/getCardImage';
import { getCardProfile } from '../utils/getCardProfile';
import { CardModal } from './CardModal';
import GPTChat from './GPTChat';
import { isPremium, ACCESS, DEFAULT_TIER, getCheckoutUrl } from '../config/access';

export function CorrectedBirthCardSpread({name, birthdate, initialAge, userTier = DEFAULT_TIER}) {
  const [age, setAge] = useState(initialAge);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState('');
  const [selectedCardDescription, setSelectedCardDescription] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState('');

  const canOpenCard = (context) => {
    if (isPremium(userTier)) return true;
    if (context === 'birth') return true;
    if (typeof context === 'object' && context.type === 'period') return !!context.isCurrent;
    return false;
  };

  // Parse birthdate to get month and day
  const { month, day } = parseBirthdate(birthdate);
  
  // Get birth card using corrected lookup
  const birthCardResult = getBirthCardFromDate(month, day);
  const birthCard = birthCardResult.card;
  const birthCardName = birthCardResult.cardName;
  
  // Calculate correct age
  const correctAge = calculateCorrectAge(birthdate);
  
  // Update age if it's different from initial
  useEffect(() => {
    if (correctAge !== age) {
      setAge(correctAge);
    }
  }, [correctAge, age]);

  // Get yearly forecast using corrected logic
  const yearlyForecastResult = getYearlyForecast(birthCard, age);
  const yearlyForecast = yearlyForecastResult.forecast;
  
  // Get birth card profile
  const birthCardProfile = getCardProfile(birthCard);

  // Get yearly spread cards (6 cards)
  const yearlySpreadCards = yearlyForecast ? getYearlySpreadCards(birthCard, yearlyForecast) : null;
  
  // Get planetary periods with dates
  const planetaryPeriods = yearlyForecast ? getPlanetaryPeriods(yearlyForecast, birthdate, age) : [];

  const handleCardClick = (card, cardName, context) => {
    const profile = getCardProfile(card);
    if (!canOpenCard(context)) return;
    setSelectedCard(card);
    setSelectedCardName(cardName || card);
    setSelectedCardDescription(profile?.description || "No description available.");
    setModalImageUrl(getCardImage(card));
  };

  const closeModal = () => {
    setSelectedCard(null);
    setSelectedCardName('');
    setSelectedCardDescription('');
    setModalImageUrl('');
  };

  if (birthCardResult.error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error: {birthCardResult.error}</h2>
        <p>Please check the birthdate: {month} {day}</p>
      </div>
    );
  }

  if (yearlyForecastResult.error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Birth Card: {birthCard}</h2>
        <h3>Error: {yearlyForecastResult.error}</h3>
        <p>Age: {age}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Decode Your Kid: {name}</h1>
        <p>Born: {birthdate} | Age: 
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(parseInt(e.target.value))} 
            style={{ margin: '0 5px', padding: '2px 5px', width: '60px' }}
          />
        </p>
        <p><strong>Birth Card: {birthCard} — {birthCardName}</strong></p>
        <button onClick={() => handleCardClick(birthCard, 'Birth Card', 'birth')} style={{marginTop:'8px', padding:'6px 10px', borderRadius:8, background:'#13293D', color:'#fff', border:'none', cursor:'pointer'}}>View Birth Card Details</button>
      </div>

      {/* Yearly Birth Card Spread - 6 Cards (images only) */}
      {yearlySpreadCards && (
        <div style={{ position:'relative' }}>
          {!isPremium(userTier) && (
            <div style={{position:'absolute', inset:0, backdropFilter:'blur(4px)', background:'rgba(255,255,255,0.7)', zIndex:5, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'20px', borderRadius:12}}>
              <div>
                <div style={{fontWeight:700, marginBottom:8}}>Unlock this insight</div>
                <div style={{marginBottom:12}}>Unlock this insight with full access for $22.22/month.</div>
                <button style={{background:'#13293D', color:'#fff', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer'}} onClick={() => { window.location.href = getCheckoutUrl(); }}>Upgrade</button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '30px' }}>
            <h2>Yearly Birth Card Spread</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center' }}>
                <h4>Birth Card</h4>
                <img 
                  src={getCardImage(yearlySpreadCards.birthCard) || "/placeholder.svg"} 
                  alt={yearlySpreadCards.birthCard}
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleCardClick(yearlySpreadCards.birthCard, `Birth Card`)}
                />
                <p>{yearlySpreadCards.birthCard}</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4>Long Range</h4>
                <img 
                  src={getCardImage(yearlySpreadCards.longRange) || "/placeholder.svg"} 
                  alt={yearlySpreadCards.longRange}
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleCardClick(yearlySpreadCards.longRange, `Long Range`)}
                />
                <p>{yearlySpreadCards.longRange}</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4>Pluto</h4>
                <img 
                  src={getCardImage(yearlySpreadCards.pluto) || "/placeholder.svg"} 
                  alt={yearlySpreadCards.pluto}
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleCardClick(yearlySpreadCards.pluto, `Pluto`)}
                />
                <p>{yearlySpreadCards.pluto}</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4>Result</h4>
                <img 
                  src={getCardImage(yearlySpreadCards.result) || "/placeholder.svg"} 
                  alt={yearlySpreadCards.result}
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleCardClick(yearlySpreadCards.result, `Result`)}
                />
                <p>{yearlySpreadCards.result}</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4>Support</h4>
                <img 
                  src={getCardImage(yearlySpreadCards.support) || "/placeholder.svg"} 
                  alt={yearlySpreadCards.support}
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleCardClick(yearlySpreadCards.support, `Support`)}
                />
                <p>{yearlySpreadCards.support}</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h4>Development</h4>
                <img 
                  src={getCardImage(yearlySpreadCards.development) || "/placeholder.svg"} 
                  alt={yearlySpreadCards.development}
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleCardClick(yearlySpreadCards.development, `Development`)}
                />
                <p>{yearlySpreadCards.development}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planetary Periods - 7 Cards */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Card Ruling Each 52-day Planetary Period</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          {planetaryPeriods.map((period, index) => (
            <div 
              key={period.name} 
              style={{ 
                position: 'relative',
                textAlign: 'center',
                padding: '10px',
                border: period.isCurrent ? '3px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: period.isCurrent ? '#f0f8ff' : '#fff'
              }}
            >
              <h4>{period.name}</h4>
              <img 
                src={getCardImage(period.card) || "/placeholder.svg"} 
                alt={period.card}
                style={{ width: '60px', cursor: 'pointer' }}
                onClick={() => handleCardClick(period.card, `${period.name} Period`, { type: 'period', isCurrent: period.isCurrent })}
              />
              
              <small>{period.dateRange}</small>
              {period.isCurrent && <div style={{ color: '#007bff', fontWeight: 'bold' }}>CURRENT</div>}
              {!isPremium(userTier) && !period.isCurrent && (
                <div style={{position:'absolute', inset:0, backdropFilter:'blur(2px)', background:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px'}}>
                  <div style={{fontSize:12, textAlign:'center'}}>
                    <div style={{fontWeight:700}}>Locked</div>
                    <div>Upgrade for full access</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* GPT Chat */}
      <div style={{ marginTop: '40px' }}>
        <GPTChat userTier={userTier} />
      </div>

      {/* Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          cardName={selectedCardName}
          description={selectedCardDescription}
          imageUrl={modalImageUrl}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
