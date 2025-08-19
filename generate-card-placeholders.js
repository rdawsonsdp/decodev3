const fs = require('fs');
const path = require('path');

// Card definitions
const suits = ['C', 'D', 'H', 'S'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suitSymbols = { 'C': '♣', 'D': '♦', 'H': '♥', 'S': '♠' };
const suitColors = { 'C': '#000', 'D': '#e74c3c', 'H': '#e74c3c', 'S': '#000' };

// Generate SVG for a card
function generateCardSVG(rank, suit) {
  const symbol = suitSymbols[suit];
  const color = suitColors[suit];
  
  return `<svg width="120" height="168" viewBox="0 0 120 168" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="168" rx="8" fill="white" stroke="#ddd" stroke-width="2"/>
  
  <!-- Top left corner -->
  <text x="12" y="24" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${color}">${rank}</text>
  <text x="12" y="42" font-family="Arial, sans-serif" font-size="14" fill="${color}">${symbol}</text>
  
  <!-- Center symbol -->
  <text x="60" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="${color}">${symbol}</text>
  
  <!-- Bottom right corner (rotated) -->
  <g transform="rotate(180 108 144)">
    <text x="12" y="24" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${color}">${rank}</text>
    <text x="12" y="42" font-family="Arial, sans-serif" font-size="14" fill="${color}">${symbol}</text>
  </g>
</svg>`;
}

// Generate all cards
const cardsDir = path.join(__dirname, 'public', 'cards');

// Create cards directory if it doesn't exist
if (!fs.existsSync(cardsDir)) {
  fs.mkdirSync(cardsDir, { recursive: true });
}

// Generate regular cards
suits.forEach(suit => {
  ranks.forEach(rank => {
    const cardCode = rank + suit;
    const svgContent = generateCardSVG(rank, suit);
    const filePath = path.join(cardsDir, `${cardCode}.svg`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Generated ${cardCode}.svg`);
  });
});

// Generate Joker
const jokerSVG = `<svg width="120" height="168" viewBox="0 0 120 168" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="168" rx="8" fill="white" stroke="#ddd" stroke-width="2"/>
  <text x="60" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#666">JOKER</text>
  <text x="60" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#e74c3c">🃏</text>
  <text x="60" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#666">JOKER</text>
</svg>`;

fs.writeFileSync(path.join(cardsDir, 'Joker.svg'), jokerSVG);
console.log('Generated Joker.svg');

console.log('\nAll card placeholders generated successfully!');
