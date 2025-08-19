const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

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

console.log('Converting Yearly Forecasts Excel file...');

try {
  const excelPath = path.join(__dirname, 'Content Source & Prompts - DYK', 'Yearly Forecasts.xlsx');
  
  // Check if file exists
  if (!fs.existsSync(excelPath)) {
    console.error('❌ Excel file not found at:', excelPath);
    process.exit(1);
  }
  
  // Read the Excel file
  const workbook = XLSX.readFile(excelPath);
  console.log('📊 Excel file read successfully');
  console.log('📋 Sheet names:', workbook.SheetNames);
  
  const allData = {};
  
  // Process each sheet
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n🔄 Processing sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, // Use array format to handle varying column structures
      defval: '', // Default value for empty cells
      raw: false // Convert numbers to strings for consistency
    });
    
    // Clean up the data and convert suit symbols
    const cleanedData = jsonData.map((row, rowIndex) => {
      if (rowIndex === 0) return row; // Keep headers as-is
      
      return row.map(cell => {
        if (typeof cell === 'string') {
          return convertSuitToLetter(cell.trim());
        }
        return cell;
      });
    }).filter(row => row.some(cell => cell !== '')); // Remove completely empty rows
    
    allData[sheetName] = cleanedData;
    console.log(`✅ Sheet "${sheetName}" processed: ${cleanedData.length} rows`);
  });
  
  // Save the raw data
  const rawOutputPath = path.join(__dirname, 'src', 'data', 'yearlyForecasts-raw.json');
  fs.writeFileSync(rawOutputPath, JSON.stringify(allData, null, 2));
  console.log(`\n✅ Raw Excel data saved to: ${path.basename(rawOutputPath)}`);
  
  // Try to create a more structured format
  const structuredData = {};
  
  Object.keys(allData).forEach(sheetName => {
    const sheetData = allData[sheetName];
    if (sheetData.length === 0) return;
    
    const headers = sheetData[0];
    const rows = sheetData.slice(1);
    
    // Convert to object format using headers
    const structuredRows = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        if (header && header.trim() !== '') {
          obj[header.trim()] = row[index] || '';
        }
      });
      return obj;
    }).filter(obj => Object.keys(obj).length > 0);
    
    structuredData[sheetName] = structuredRows;
  });
  
  // Save the structured data
  const structuredOutputPath = path.join(__dirname, 'src', 'data', 'yearlyForecasts-structured.json');
  fs.writeFileSync(structuredOutputPath, JSON.stringify(structuredData, null, 2));
  console.log(`✅ Structured Excel data saved to: ${path.basename(structuredOutputPath)}`);
  
  // Create a summary of the Excel content
  const summary = {
    totalSheets: workbook.SheetNames.length,
    sheets: workbook.SheetNames.map(name => ({
      name,
      rowCount: allData[name] ? allData[name].length : 0,
      columnCount: allData[name] && allData[name][0] ? allData[name][0].length : 0,
      headers: allData[name] && allData[name][0] ? allData[name][0] : []
    })),
    conversionDate: new Date().toISOString(),
    notes: [
      'Suit symbols (♦♥♣♠) have been converted to letter codes (D,H,C,S)',
      'Raw data preserves the exact Excel structure',
      'Structured data converts rows to objects using column headers',
      'Empty rows and columns have been filtered out'
    ]
  };
  
  const summaryPath = path.join(__dirname, 'src', 'data', 'yearlyForecasts-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`✅ Excel summary saved to: ${path.basename(summaryPath)}`);
  
  console.log('\n📊 Excel Conversion Summary:');
  console.log(`• Total sheets processed: ${summary.totalSheets}`);
  summary.sheets.forEach(sheet => {
    console.log(`  - ${sheet.name}: ${sheet.rowCount} rows, ${sheet.columnCount} columns`);
  });
  
  console.log('\n✨ Excel conversion complete!');
  
} catch (error) {
  console.error('❌ Error processing Excel file:', error.message);
  
  if (error.message.includes('ENOENT')) {
    console.log('\n💡 Make sure the Excel file exists at:');
    console.log('   Content Source & Prompts - DYK/Yearly Forecasts.xlsx');
  } else {
    console.log('\n💡 This might be due to:');
    console.log('   - Corrupted Excel file');
    console.log('   - Unsupported Excel format');
    console.log('   - File permissions');
  }
}
