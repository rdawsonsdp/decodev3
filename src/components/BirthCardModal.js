import React from 'react';
import { CardModal } from './CardModal';
import profilesLookup from '../data/profilesLookup.json';

const BirthCardModal = ({ birthCard, onClose }) => {
  if (!birthCard) return null;

  const getCardProfile = () => {
    if (!birthCard || !birthCard.card) return null;
    return profilesLookup[birthCard.card] || null;
  };

  const profile = getCardProfile();

  if (!profile) {
    return (
      <CardModal
        card={birthCard.card}
        cardName={birthCard.cardName}
        description="Profile information not available for this card."
        imageUrl={`/cards/${birthCard.card}.svg`}
        onClose={onClose}
      />
    );
  }

  return (
    <CardModal
      card={birthCard.card}
      cardName={birthCard.cardName}
      description={profile.description || "No description available."}
      imageUrl={`/cards/${birthCard.card}.svg`}
      onClose={onClose}
    />
  );
};

export default BirthCardModal;
