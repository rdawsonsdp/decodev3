// Test script to verify birth card lookup logic
const fs = require('fs');
const path = require('path');

// Read the JSON data
const birthdateToCardData = JSON.parse(fs.readFileSync('./src/data/birthdateToCard.json', 'utf8'));

// Function to get birth card from date (same as utility)
function getBirthCardFromDate(month, day) {
  const dateString = `${month} ${day}`;
  const match = birthdateToCardData.find(row => row.Date?.trim() === dateString.trim());
  
  if (!match) {
    return {
      card: null,
      cardName: null,
      error: `No card found for ${dateString}`
    };
  }
  
  return {
    card: match.Card,
    cardName: match["Card Name"]
  };
}

// Test with October 5, 1968
console.log('Testing birth card lookup for October 5, 1968...');
const result = getBirthCardFromDate('October', 5);
console.log('Result:', result);

if (result.card === '4♦') {
  console.log('✅ SUCCESS: Birth card is correctly 4♦ (Four of Diamonds)');
} else {
  console.log(`❌ FAILURE: Expected 4♦, got ${result.card}`);
}

// Test a few more dates to verify data integrity
console.log('\nTesting additional dates...');
const testDates = [
  ['January', 1],
  ['December', 31],
  ['February', 29], // Leap year date
  ['July', 4]
];

testDates.forEach(([month, day]) => {
  const testResult = getBirthCardFromDate(month, day);
  console.log(`${month} ${day}: ${testResult.card || 'Not found'}`);
});

console.log(`\nTotal records in data: ${birthdateToCardData.length}`);
