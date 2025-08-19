import birthdateLookup from '../data/birthdateLookup.json';

export function getBirthCardFromDate(dateStr) {
  const match = birthdateLookup[dateStr.trim()];

  if (!match) {
    return {
      card: null,
      cardName: null,
      error: `No card found for ${dateStr}`
    };
  }

  return {
    card: match.card,
    cardName: match.cardName
  };
}
