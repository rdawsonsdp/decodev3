
// Example usage of the card data

// Import the combined data
const cardData = require('./src/data/combinedCardData.json');

// Or import individual files
const birthdateLookup = require('./src/data/birthdateLookup.json');
const activitiesLookup = require('./src/data/activitiesLookup.json');
const profilesLookup = require('./src/data/profilesLookup.json');

// Look up a card by birthdate
const birthdate = "January 1";
const cardInfo = birthdateLookup[birthdate];
if (cardInfo) {
  console.log(`Card for ${birthdate}: ${cardInfo.card} - ${cardInfo.cardName}`);
  
  // Get activities for this card
  const activities = activitiesLookup[cardInfo.card];
  if (activities) {
    console.log('Activities:', activities);
  }
  
  // Get profile for this card
  const profile = profilesLookup[cardInfo.card];
  if (profile) {
    console.log('Profile:', profile.description);
    console.log('Zone of Genius:', profile.zoneOfGenius);
  }
}
