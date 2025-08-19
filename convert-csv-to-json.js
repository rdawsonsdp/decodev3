const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Function to convert suit symbols to letters
function convertSuitToLetter(cardCode) {
  if (!cardCode) return cardCode;
  return cardCode
    .replace(/♦/g, 'D')
    .replace(/♥/g, 'H')
    .replace(/♣/g, 'C')
    .replace(/♠/g, 'S')
    .replace(/🎭/g, 'Joker');
}

// Function to read CSV and convert to JSON
function convertCSVtoJSON(csvPath, outputPath, processRow) {
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
      bom: true // Handle BOM character
    });
    
    const processedData = processRow ? records.map(processRow).filter(item => item !== null) : records;
    
    fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
    console.log(`✅ Converted ${path.basename(csvPath)} to ${path.basename(outputPath)}`);
    return processedData;
  } catch (error) {
    console.error(`❌ Error processing ${csvPath}:`, error.message);
    return null;
  }
}

// 1. Convert Birthdate to Card CSV
console.log('Converting Birthdate to Card CSV...');
const birthdateData = convertCSVtoJSON(
  path.join(__dirname, 'Content Source & Prompts - DYK', 'Birthdate to Card.csv'),
  path.join(__dirname, 'src', 'data', 'birthdateToCard.json'),
  (row) => {
    // Skip empty rows or rows without date/card
    if (!row['Date'] || !row['Card']) return null;
    return {
      date: row['Date'].trim(),
      card: convertSuitToLetter(row['Card'].trim()),
      cardName: row['Card Name'] ? row['Card Name'].trim() : ''
    };
  }
);

// Create a lookup object for birthdate to card
if (birthdateData) {
  const birthdateLookup = {};
  birthdateData.forEach(item => {
    if (item.date) {
      birthdateLookup[item.date] = {
        card: item.card,
        cardName: item.cardName
      };
    }
  });
  fs.writeFileSync(
    path.join(__dirname, 'src', 'data', 'birthdateLookup.json'),
    JSON.stringify(birthdateLookup, null, 2)
  );
  console.log('✅ Created birthdateLookup.json');
}

// 2. Convert Card to Activities CSV
console.log('\nConverting Card to Activities CSV...');
const activitiesData = convertCSVtoJSON(
  path.join(__dirname, 'Content Source & Prompts - DYK', 'Card to Activities DYK.csv'),
  path.join(__dirname, 'src', 'data', 'cardToActivities.json'),
  (row) => {
    if (!row['Card']) return null;
    return {
      card: convertSuitToLetter(row['Card'].trim()),
      activities: row['Activities'] || ''
    };
  }
);

// Create a lookup object for card to activities
if (activitiesData) {
  const activitiesLookup = {};
  activitiesData.forEach(item => {
    if (item.card && item.activities) {
      activitiesLookup[item.card] = item.activities;
    }
  });
  fs.writeFileSync(
    path.join(__dirname, 'src', 'data', 'activitiesLookup.json'),
    JSON.stringify(activitiesLookup, null, 2)
  );
  console.log('✅ Created activitiesLookup.json');
}

// 3. Convert DYK Card Profiles CSV
console.log('\nConverting DYK Card Profiles CSV...');
try {
  const profilesPath = path.join(__dirname, 'Content Source & Prompts - DYK', 'DYK Card Profiles.csv');
  const csvContent = fs.readFileSync(profilesPath, 'utf-8');
  const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true
  });
  
  const profilesData = records.map(row => {
    if (!row['Card']) return null;
    return {
      card: convertSuitToLetter(row['Card'].trim()),
      description: row['Description'] || '',
      zoneOfGenius: row['Zone of Genius'] || '',
      activitiesToEncourage: row['Activities to Encourage & Nurture'] || '',
      activitiesToSoothe: row['Activities to Soothe When Sad or Stressed'] || ''
    };
  }).filter(item => item !== null);
  
  fs.writeFileSync(
    path.join(__dirname, 'src', 'data', 'cardProfiles.json'),
    JSON.stringify(profilesData, null, 2)
  );
  console.log('✅ Created cardProfiles.json');
  
  // Create a lookup object for card profiles
  const profilesLookup = {};
  profilesData.forEach(item => {
    if (item.card) {
      profilesLookup[item.card] = {
        description: item.description,
        zoneOfGenius: item.zoneOfGenius,
        activitiesToEncourage: item.activitiesToEncourage,
        activitiesToSoothe: item.activitiesToSoothe
      };
    }
  });
  fs.writeFileSync(
    path.join(__dirname, 'src', 'data', 'profilesLookup.json'),
    JSON.stringify(profilesLookup, null, 2)
  );
  console.log('✅ Created profilesLookup.json');
} catch (error) {
  console.error('❌ Error processing DYK Card Profiles:', error.message);
}

// 4. Note about Excel file
console.log('\n📝 Note: The Yearly Forecasts.xlsx file requires special handling.');
console.log('You can use libraries like "xlsx" or "exceljs" to read Excel files in Node.js.');
console.log('Example installation: npm install xlsx');
console.log('Then you can read it with:');
console.log('const XLSX = require("xlsx");');
console.log('const workbook = XLSX.readFile("path/to/file.xlsx");');
console.log('const sheetName = workbook.SheetNames[0];');
console.log('const worksheet = workbook.Sheets[sheetName];');
console.log('const data = XLSX.utils.sheet_to_json(worksheet);');

// Create a summary file with all data combined
console.log('\nCreating combined data file...');
try {
  const birthdateLookup = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'birthdateLookup.json'), 'utf-8'));
  const activitiesLookup = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'activitiesLookup.json'), 'utf-8'));
  const profilesLookup = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'profilesLookup.json'), 'utf-8'));
  
  const combinedData = {
    birthdates: birthdateLookup,
    activities: activitiesLookup,
    profiles: profilesLookup
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'src', 'data', 'combinedCardData.json'),
    JSON.stringify(combinedData, null, 2)
  );
  console.log('✅ Created combinedCardData.json');
  
  // Create a sample usage file
  const sampleUsage = `
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
  console.log(\`Card for \${birthdate}: \${cardInfo.card} - \${cardInfo.cardName}\`);
  
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
`;
  
  fs.writeFileSync(
    path.join(__dirname, 'src', 'data', 'usage-example.js'),
    sampleUsage
  );
  console.log('✅ Created usage-example.js');
  
} catch (error) {
  console.error('❌ Error creating combined data:', error.message);
}

console.log('\n✨ Conversion complete!');
console.log('JSON files have been created in the src/data directory.');
console.log('Check src/data/usage-example.js for sample code on how to use the data.');
