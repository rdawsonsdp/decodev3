#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Cardology Backend Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local not found. Run setup-backend.js first.');
  process.exit(1);
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    envVars[key.trim()] = value.trim();
  }
});

console.log('📋 Environment Variables Check:');
console.log('================================');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PINECONE_API_KEY',
  'PINECONE_ENVIRONMENT',
  'OPENAI_API_KEY',
  'JWT_SECRET',
  'ENCRYPTION_KEY'
];

let allConfigured = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value.includes('your_')) {
    console.log(`❌ ${varName}: Not configured`);
    allConfigured = false;
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

console.log('\n📁 File Structure Check:');
console.log('========================');

const requiredFiles = [
  'lib/database/config.ts',
  'lib/database/schema.sql',
  'lib/services/document-storage.ts',
  'lib/services/vector-indexing.ts',
  'lib/services/context-manager.ts',
  'lib/security/auth.ts',
  'app/api/upload/route.ts',
  'app/api/context/route.ts'
];

let allFilesExist = true;

requiredFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filePath}: Exists`);
  } else {
    console.log(`❌ ${filePath}: Missing`);
    allFilesExist = false;
  }
});

console.log('\n📦 Dependencies Check:');
console.log('======================');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  '@supabase/supabase-js',
  '@pinecone-database/pinecone',
  'jsonwebtoken'
];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: Installed`);
  } else {
    console.log(`❌ ${dep}: Missing`);
    allFilesExist = false;
  }
});

console.log('\n🎯 Setup Status:');
console.log('================');

if (allConfigured && allFilesExist) {
  console.log('✅ Backend setup is complete!');
  console.log('\n🚀 Next steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Test the API endpoints');
  console.log('3. Upload some sample documents');
  console.log('4. Test context generation');
} else {
  console.log('❌ Backend setup is incomplete.');
  console.log('\n🔧 Please:');
  if (!allConfigured) {
    console.log('- Configure all environment variables in .env.local');
  }
  if (!allFilesExist) {
    console.log('- Ensure all required files are present');
    console.log('- Run: npm install to install dependencies');
  }
}

console.log('\n📚 For detailed setup instructions, see: CARDOLOGY_BACKEND_SETUP.md');
