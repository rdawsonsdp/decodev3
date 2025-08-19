// Quick test to verify the data conversion worked correctly
const birthdateLookup = require('./src/data/birthdateLookup.json');
const activitiesLookup = require('./src/data/activitiesLookup.json');
const profilesLookup = require('./src/data/profilesLookup.json');
const combinedData = require('./src/data/combinedCardData.json');

console.log('🧪 Testing converted data...\n');

// Test 1: Birthdate lookup
const testDate = "January 1";
const cardInfo = birthdateLookup[testDate];
console.log(`📅 ${testDate}:`);
console.log(`   Card: ${cardInfo?.card} - ${cardInfo?.cardName}`);

if (cardInfo) {
  // Test 2: Activities lookup
  const activities = activitiesLookup[cardInfo.card];
  console.log(`   Has activities: ${activities ? 'Yes' : 'No'}`);
  
  // Test 3: Profile lookup
  const profile = profilesLookup[cardInfo.card];
  console.log(`   Has profile: ${profile ? 'Yes' : 'No'}`);
  if (profile) {
    console.log(`   Zone of Genius preview: ${profile.zoneOfGenius?.substring(0, 50)}...`);
  }
}

// Test 4: Combined data structure
console.log(`\n📊 Data Statistics:`);
console.log(`   Birthdate entries: ${Object.keys(birthdateLookup).length}`);
console.log(`   Activity entries: ${Object.keys(activitiesLookup).length}`);
console.log(`   Profile entries: ${Object.keys(profilesLookup).length}`);
console.log(`   Combined data keys: ${Object.keys(combinedData).join(', ')}`);

// Test 5: Card code conversion verification
console.log(`\n🃏 Card Code Samples:`);
const sampleCards = ['AH', '10D', 'KS', 'JC', '2H'];
sampleCards.forEach(card => {
  const hasActivities = activitiesLookup[card] ? '✓' : '✗';
  const hasProfile = profilesLookup[card] ? '✓' : '✗';
  console.log(`   ${card}: Activities ${hasActivities} Profile ${hasProfile}`);
});

console.log('\n✅ Data test complete!');
