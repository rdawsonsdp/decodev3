const fs = require('fs');
const path = require('path');

console.log('Converting Yearly Forecast CSV file...');

try {
  const csvPath = path.join(__dirname, 'Yearly_data', 'Yearly Forecast.csv');
  
  // Check if file exists
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    process.exit(1);
  }
  
  // Read the CSV file
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  console.log('📊 CSV file read successfully');
  
  // Parse CSV content
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  
  console.log('📋 Headers:', headers);
  console.log(`📊 Total rows: ${lines.length - 1}`);
  
  // Convert to the expected JSON format
  const yearlyForecasts = {};
  
  // Process each data row
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length < headers.length) {
      console.warn(`⚠️  Row ${i + 1} has fewer columns than headers, skipping...`);
      continue;
    }
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    const birthCard = row['Birth Card'];
    const age = parseInt(row['AGE']);
    
    if (!birthCard || isNaN(age)) {
      console.warn(`⚠️  Row ${i + 1} has invalid birth card or age, skipping...`);
      continue;
    }
    
    // Initialize birth card array if it doesn't exist
    if (!yearlyForecasts[birthCard]) {
      yearlyForecasts[birthCard] = [];
    }
    
    // Create the forecast entry
    const forecastEntry = {
      age: age,
      mercury: row['Mercury'] || '',
      venus: row['Venus'] || '',
      mars: row['Mars'] || '',
      jupiter: row['Jupiter'] || '',
      saturn: row['Saturn '] || row['Saturn'] || '', // Handle space in header
      uranus: row['Uranus'] || '',
      neptune: row['Neptune'] || '',
      longRange: row['LONG RANGE'] || '',
      pluto: row['PLUTO'] || '',
      result: row['RESULT'] || '',
      support: row['SUPPORT'] || '',
      development: row['DEVELOPMENT'] || ''
    };
    
    yearlyForecasts[birthCard].push(forecastEntry);
  }
  
  // Sort each birth card's entries by age
  Object.keys(yearlyForecasts).forEach(birthCard => {
    yearlyForecasts[birthCard].sort((a, b) => a.age - b.age);
  });
  
  // Save the converted data
  const outputPath = path.join(__dirname, 'src', 'data', 'yearlyForecasts.json');
  fs.writeFileSync(outputPath, JSON.stringify(yearlyForecasts, null, 2));
  
  console.log(`\n✅ Converted data saved to: ${path.basename(outputPath)}`);
  
  // Create summary
  const summary = {
    totalBirthCards: Object.keys(yearlyForecasts).length,
    totalEntries: Object.values(yearlyForecasts).reduce((sum, entries) => sum + entries.length, 0),
    birthCards: Object.keys(yearlyForecasts).sort(),
    ageRanges: Object.keys(yearlyForecasts).map(birthCard => ({
      birthCard,
      minAge: Math.min(...yearlyForecasts[birthCard].map(e => e.age)),
      maxAge: Math.max(...yearlyForecasts[birthCard].map(e => e.age)),
      entryCount: yearlyForecasts[birthCard].length
    })),
    conversionDate: new Date().toISOString(),
    sourceFile: 'Yearly_data/Yearly Forecast.csv'
  };
  
  const summaryPath = path.join(__dirname, 'src', 'data', 'yearlyForecasts-conversion-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('\n📊 Conversion Summary:');
  console.log(`• Total birth cards: ${summary.totalBirthCards}`);
  console.log(`• Total entries: ${summary.totalEntries}`);
  console.log(`• Age range: ${Math.min(...summary.ageRanges.map(r => r.minAge))} - ${Math.max(...summary.ageRanges.map(r => r.maxAge))}`);
  
  // Show sample of data with support/development
  const sampleWithSupport = Object.keys(yearlyForecasts).find(birthCard => 
    yearlyForecasts[birthCard].some(entry => entry.support && entry.support.trim() !== '')
  );
  
  if (sampleWithSupport) {
    const sampleEntry = yearlyForecasts[sampleWithSupport].find(entry => entry.support && entry.support.trim() !== '');
    console.log(`\n📋 Sample entry with Support/Development data:`);
    console.log(`   Birth Card: ${sampleWithSupport}, Age: ${sampleEntry.age}`);
    console.log(`   Support: ${sampleEntry.support}, Development: ${sampleEntry.development}`);
  }
  
  console.log('\n✨ CSV conversion complete!');
  
} catch (error) {
  console.error('❌ Error processing CSV file:', error.message);
  process.exit(1);
}
