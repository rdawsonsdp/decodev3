export function getCardImage(card: string): string if (!card) return ''
  
  // Convert card notation to filename format
  // For example: "5♦" becomes "/cards/5D.png"
  
  // Map Unicode suit symbols to letters
  const suitMap: { [key: string]: string } = '♠': 'S',
    '♥': 'H',
    '♦': 'D',
    '♣': 'C'
  
  // Extract value and suit
  const value = card.slice(0, card.length - 1)
  const suit = card.slice(-1)
  
  // Convert suit symbol to letter
  const suitLetter = suitMap[suit] || suit
  
  // Handle special cases like "10"
  const cardValue = value === '10' ? '10' : value
  
  return `/cards/${cardValue}${suitLetter}.png`
