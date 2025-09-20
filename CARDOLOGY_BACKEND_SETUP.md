# Cardology Backend Memory & Context System Setup

This document provides step-by-step instructions for setting up the backend memory and context handling system for the Cardology ecosystem.

## Overview

The system consists of:
- **Supabase PostgreSQL** for document storage and metadata
- **Pinecone** for vector embeddings and semantic search
- **Next.js API routes** for secure document upload and context retrieval
- **JWT authentication** for user access control

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Pinecone Account**: Sign up at [pinecone.io](https://pinecone.io)
3. **OpenAI API Key**: For generating embeddings

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from Settings > API

### 1.2 Run Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `lib/database/schema.sql`
3. Execute the SQL to create all tables, indexes, and policies

### 1.3 Configure Authentication
1. Go to Authentication > Settings in Supabase
2. Enable email authentication
3. Configure JWT settings (optional, for custom auth)

## Step 2: Pinecone Setup

### 2.1 Create Pinecone Index
1. Go to [pinecone.io](https://pinecone.io) and create an account
2. Create a new index with these settings:
   - **Name**: `cardology-context`
   - **Dimensions**: `1536` (for OpenAI embeddings)
   - **Metric**: `cosine`
   - **Cloud**: Choose your preferred region

### 2.2 Get API Credentials
1. Note down your API key from the Pinecone console
2. Note down your environment (e.g., `us-east-1-aws`)

## Step 3: Environment Configuration

### 3.1 Create Environment File
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=cardology-context

# OpenAI Configuration (for embeddings)
OPENAI_API_KEY=your_openai_api_key

# Security
JWT_SECRET=your_jwt_secret_key_32_chars_minimum
ENCRYPTION_KEY=your_encryption_key_32_chars_exactly

# App Configuration
NEXT_PUBLIC_APP_ENV=development
```

### 3.2 Generate Security Keys
```bash
# Generate JWT secret (32+ characters)
openssl rand -base64 32

# Generate encryption key (exactly 32 characters)
openssl rand -hex 16
```

## Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js @pinecone-database/pinecone jsonwebtoken
npm install -D @types/jsonwebtoken
```

## Step 5: Test the Setup

### 5.1 Test Database Connection
Create a test script `test-db.js`:

```javascript
import { supabase } from './lib/database/config.js'

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('app_contexts')
      .select('*')
      .limit(1)
    
    if (error) throw error
    console.log('✅ Database connection successful')
    console.log('App contexts:', data)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testConnection()
```

### 5.2 Test Pinecone Connection
Create a test script `test-pinecone.js`:

```javascript
import { pineconeIndex } from './lib/database/config.js'

async function testPinecone() {
  try {
    const stats = await pineconeIndex.describeIndexStats()
    console.log('✅ Pinecone connection successful')
    console.log('Index stats:', stats)
  } catch (error) {
    console.error('❌ Pinecone connection failed:', error)
  }
}

testPinecone()
```

## Step 6: API Endpoints

The system provides these API endpoints:

### Document Upload
- **POST** `/api/upload` - Upload documents
- **GET** `/api/upload?userId=...` - List user documents
- **DELETE** `/api/upload?documentId=...&userId=...` - Delete document

### Context Management
- **POST** `/api/context` - Generate contextual responses
- **GET** `/api/context?action=stats&userId=...` - Get user statistics
- **GET** `/api/context?action=session&userId=...&appType=...` - Get user session
- **PUT** `/api/context` - Update user session

## Step 7: Usage Examples

### 7.1 Upload a Document
```javascript
const formData = new FormData()
formData.append('file', file)
formData.append('appType', 'dyk')
formData.append('contentType', 'book')
formData.append('title', 'My Cardology Book')
formData.append('userId', 'user-123')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

### 7.2 Generate Contextual Response
```javascript
const response = await fetch('/api/context', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'How do I understand my child\'s emotional needs?',
    appType: 'dyk',
    userId: 'user-123',
    userContext: {
      birthCard: 'Ace of Hearts',
      yearlyCard: 'King of Spades'
    }
  })
})
```

## Step 8: Security Considerations

### 8.1 Row Level Security
- All tables have RLS enabled
- Users can only access their own documents
- Service role has full access for processing

### 8.2 File Upload Security
- File type validation
- File size limits (10MB max)
- Content sanitization
- Duplicate detection via hash

### 8.3 API Security
- JWT authentication required
- Rate limiting (implement with Redis in production)
- Input validation and sanitization
- Audit logging for all actions

## Step 9: Production Deployment

### 9.1 Environment Variables
Set all environment variables in your production environment (Vercel, etc.)

### 9.2 Database Optimization
- Monitor query performance
- Add indexes as needed
- Set up database backups

### 9.3 Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor API usage and performance
- Track document processing success rates

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Supabase URL and keys
   - Verify RLS policies
   - Check network connectivity

2. **Pinecone Connection Failed**
   - Verify API key and environment
   - Check index name and dimensions
   - Ensure index is ready

3. **Embedding Generation Failed**
   - Check OpenAI API key
   - Verify API quota and limits
   - Check content length limits

4. **File Upload Issues**
   - Check file size and type
   - Verify form data format
   - Check user authentication

### Support
For issues with this setup, check:
1. Supabase documentation
2. Pinecone documentation
3. OpenAI API documentation
4. Next.js API routes documentation

## Next Steps

After setup is complete:
1. Test with sample documents
2. Implement frontend components
3. Add user authentication
4. Set up monitoring and alerts
5. Deploy to production
