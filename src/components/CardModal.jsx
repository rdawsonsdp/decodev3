import React, { useState, useEffect } from 'react';
import { getCardProfile } from '../utils/getCardProfile';
import { getCardImage } from '../utils/getCardImage';

export function CardModal({ card, cardName, description, imageUrl, onClose }) {
  if (!card) return null;

  const [flipped, setFlipped] = useState(false);
  const profile = getCardProfile(card);
  const imgSrc = imageUrl || getCardImage(card);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const backDescription = description || profile?.description || profile?.summary || '';

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          width: 'min(92vw, 760px)',
          perspective: '1000px'
        }}
      >
        <div
          className={flipped ? 'card flipped' : 'card'}
          onClick={() => setFlipped((f) => !f)}
          style={{
            position: 'relative',
            width: '100%',
            height: 'min(86vh, 640px)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s ease',
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
            borderRadius: '16px',
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          {/* FRONT */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img
              src={imgSrc}
              alt={cardName || card}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* BACK */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 18, fontWeight: 700, color: '#111827' }}>
              {cardName || card}
            </div>
            <div
              style={{
                overflowY: 'auto',
                maxHeight: 'calc(86vh - 80px)',
                paddingRight: 8,
                color: '#374151',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}
            >
              {backDescription || 'No description available.'}
            </div>
          </div>
        </div>
        <style>{`
          .card.flipped { transform: rotateY(180deg); }
          .card:hover { box-shadow: 0 14px 28px rgba(0,0,0,0.28); }
        `}</style>
        <div style={{ textAlign: 'center', marginTop: 10, color: '#9CA3AF' }}>
          Click card to flip · Click outside or press Esc to close
        </div>
      </div>
    </div>
  );
}
