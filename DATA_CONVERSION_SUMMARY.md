# Data Conversion Summary

This document summarizes the successful conversion of CSV files and Excel data to JSON format for the Decode Your Kid card application.

## Files Converted

### 1. Birthdate to Card Mapping
**Source:** `Content Source & Prompts - DYK/Birthdate to Card.csv`
**Output Files:**
- `/src/data/birthdateToCard.json` - Array format with all birthdate-to-card mappings
- `/src/data/birthdateLookup.json` - Object format for fast lookup by date

**Structure:**
\`\`\`json
{
  "January 1": {
    "card": "KS",
    "cardName": "King of Spades"
  }
}
\`\`\`

### 2. Card to Activities Mapping
**Source:** `Content Source & Prompts - DYK/Card to Activities DYK.csv`
**Output Files:**
- `/src/data/cardToActivities.json` - Array format with all card-to-activities mappings
- `/src/data/activitiesLookup.json` - Object format for fast lookup by card

**Structure:**
\`\`\`json
{
  "AH": "Ace ♥ : Discovering Emotional Needs and Relationships\nFocus: The child is learning to understand..."
}
\`\`\`

### 3. Card Profiles
**Source:** `Content Source & Prompts - DYK/DYK Card Profiles.csv`
**Output Files:**
- `/src/data/cardProfiles.json` - Array format with all card profiles
- `/src/data/profilesLookup.json` - Object format for fast lookup by card

**Structure:**
\`\`\`json
{
  "AH": {
    "description": "A ♥ The Love Bug\nChildren born under the Ace ♥...",
    "zoneOfGenius": "Zone of Genius: This child is like a little trailblazer...",
    "activitiesToEncourage": "Activities to encourage and nurture an Ace ♥ child...",
    "activitiesToSoothe": "Activities to soothe an Ace ♥ child when they are sad..."
  }
}
\`\`\`

### 4. Yearly Forecasts (Excel)
**Source:** `Content Source & Prompts - DYK/Yearly Forecasts.xlsx`
**Output Files:**
- `/src/data/yearlyForecasts-raw.json` - Raw Excel data preserving original structure
- `/src/data/yearlyForecasts-structured.json` - Structured data with headers as object keys
- `/src/data/yearlyForecasts-summary.json` - Summary of Excel file structure

**Details:**
- 52 sheets (one for each card)
- ~92 rows per sheet (yearly forecasts)
- 13 columns per sheet

### 5. Combined Data File
**Output:** `/src/data/combinedCardData.json`
**Structure:**
\`\`\`json
{
  "birthdates": { /* birthdateLookup data */ },
  "activities": { /* activitiesLookup data */ },
  "profiles": { /* profilesLookup data */ }
}
\`\`\`

## Suit Symbol Conversion

All suit symbols have been converted to letter codes for consistency with card image filenames:
- ♦ → D (Diamonds)
- ♥ → H (Hearts) 
- ♣ → C (Clubs)
- ♠ → S (Spades)
- 🎭 → Joker

## Card Code Examples
- `A♥` → `AH` (Ace of Hearts)
- `10♦` → `10D` (Ten of Diamonds)
- `K♠` → `KS` (King of Spades)
- `J♣` → `JC` (Jack of Clubs)

## Usage Examples

### Basic Lookup
\`\`\`javascript
// Import the combined data
const cardData = require('./src/data/combinedCardData.json');

// Look up a card by birthdate
const birthdate = "January 1";
const cardInfo = cardData.birthdates[birthdate];
if (cardInfo) {
  console.log(`Card: ${cardInfo.card} - ${cardInfo.cardName}`);
  
  // Get activities for this card
  const activities = cardData.activities[cardInfo.card];
  console.log('Activities:', activities);
  
  // Get profile for this card
  const profile = cardData.profiles[cardInfo.card];
  console.log('Zone of Genius:', profile.zoneOfGenius);
}
\`\`\`

### Direct File Import
\`\`\`javascript
// Import individual lookup files
const birthdateLookup = require('./src/data/birthdateLookup.json');
const activitiesLookup = require('./src/data/activitiesLookup.json');
const profilesLookup = require('./src/data/profilesLookup.json');

// Use as needed
const card = birthdateLookup["December 25"]?.card;
const activities = activitiesLookup[card];
\`\`\`

## File Sizes and Data Volume

- **Total Cards:** 53 (52 standard cards + 1 Joker)
- **Total Birthdates:** 366 (including December 30 as Joker)
- **Activities Data:** Comprehensive activities for each card
- **Profile Data:** Detailed profiles with descriptions, zones of genius, and activity recommendations
- **Yearly Forecasts:** 52 sheets × ~92 rows × 13 columns = ~62,000 data points

## Integration Notes

1. **Card Images:** Card codes match the naming convention in `/public/cards/` (e.g., `AH.png`, `10D.png`)

2. **React Components:** Can import JSON files directly:
   \`\`\`javascript
   import cardData from '../data/combinedCardData.json';
   \`\`\`

3. **Performance:** Lookup files are optimized for O(1) access by key

4. **Data Integrity:** All suit symbols have been consistently converted and validated

## Conversion Scripts

Two scripts were created for the conversion process:
- `convert-csv-to-json.js` - Handles CSV files
- `convert-excel-to-json.js` - Handles Excel file

Both scripts can be re-run if source data is updated:
\`\`\`bash
node convert-csv-to-json.js
node convert-excel-to-json.js
\`\`\`

## Dependencies Added

- `csv-parse`: For CSV file processing
- `xlsx`: For Excel file processing

These are included in `package.json` and can be installed with `npm install`.
