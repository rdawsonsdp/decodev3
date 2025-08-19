import React from 'react';
import { getCardImage } from '../utils/getCardImage';
import { getBirthCardFromDate } from '../utils/getBirthCardFromDate';

export function BirthCardDisplay({ month, day, onBirthCardClick }) {
  const dateStr = `${month} ${day}`;
  const birthCard = getBirthCardFromDate(dateStr);
  const cardImg = getCardImage(birthCard.card);

  if (!birthCard.card) return <p>No card found.</p>;

  return (
    <div 
      style={{ 
        marginTop: '24px', 
        textAlign: 'center',
        cursor: 'pointer'
      }}
      onClick={() => onBirthCardClick && onBirthCardClick()}
    >
      <img
        src={cardImg}
        alt={birthCard.cardName}
        style={{ 
          width: '96px', 
          margin: '0 auto 12px',
          '@media (min-width: 640px)': {
            width: '128px'
          }
        }}
        onError={(e) => {
          e.target.src = '/cards/Joker.svg';
        }}
      />
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#13293D',
        margin: '0'
      }}>
        {birthCard.card} — {birthCard.cardName}
      </h2>
      <p style={{
        fontSize: '14px', 
        color: '#666', 
        marginTop: '10px'
      }}>
        Click to learn more about your child's personality
      </p>
    </div>
  );
}
