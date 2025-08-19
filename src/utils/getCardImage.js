export function getCardImage(card, type = 'svg') {
  if (!card) return null;

  // Handle cards that are already in the correct format (like "5D")
  if (card.length >= 2 && /[CDHS]$/.test(card)) {
    return `/cards/${card}.${type}`;
  }

  // Handle cards with suit symbols (like "5♦")
  const value = card.slice(0, -1);
  const suit = card.slice(-1);

  const suitMap = {
    '♣': 'C',
    '♦': 'D', 
    '♥': 'H',
    '♠': 'S'
  };

  const filename = `${value}${suitMap[suit]}.${type}`;
  return `/cards/${filename}`;
}
