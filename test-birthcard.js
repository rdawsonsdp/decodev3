// Test script to verify birthcard lookup
const fs = require('fs');

try {
  const birthdateLookup = JSON.parse(fs.readFileSync('./src/data/birthdateLookup.json', 'utf8'));
  
  // Test case: January 22, 1974 should yield 5 of Diamonds
  const testDate = "January 22";
  const result = birthdateLookup[testDate];
  
  console.log('=== Birth Card Lookup Test ===');
  console.log(`Test Date: ${testDate}`);
  console.log(`Expected: 5D (Five of Diamonds)`);
  console.log(`Actual: ${result ? result.card : 'Not found'} (${result ? result.cardName : 'N/A'})`);
  
  if (result && result.card === '5D' && result.cardName === 'Five of Diamonds') {
    console.log('✅ TEST PASSED! Birthcard lookup is working correctly.');
  } else {
    console.log('❌ TEST FAILED! Check the birthcard mapping.');
  }
  
  console.log('\n=== Sample Forecast Test ===');
  
  // Test forecast data - convert 5D to 5♦ format
  const yearlyForecasts = JSON.parse(fs.readFileSync('./src/data/yearlyForecasts-structured.json', 'utf8'));
  const cardSymbol = '5♦'; // Convert 5D to symbol format
  const forecastData = yearlyForecasts[cardSymbol];
  
  if (forecastData) {
    console.log(`Found forecast data for 5D card`);
    const ageData = forecastData.find(entry => entry.AGE === '10');
    if (ageData) {
      console.log(`Age 10 forecast for 5D:`, {
        Mercury: ageData['Communcations'],
        Venus: ageData['Culture & Client Experience'],
        Mars: ageData['Operations & Executions'],
        Jupiter: ageData['Business Development'],
        Saturn: ageData['Legal, Finance & Infrastructure'],
        Uranus: ageData['Innovation,   R& D'],
        Neptune: ageData['Vision & Purpose'],
        LongRange: ageData['LONG RANGE'],
        Result: ageData['RESULT'],
        Support: ageData['SUPPORT'],
        Development: ageData['DEVELOPMENT']
      });
      console.log('✅ Forecast data available');
    } else {
      console.log('❌ No forecast data for age 10');
    }
  } else {
    console.log('❌ No forecast data found for 5D card');
  }
  
} catch (error) {
  console.error('Error running test:', error.message);
}
