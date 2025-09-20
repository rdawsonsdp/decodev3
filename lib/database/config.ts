import { createClient } from '@supabase/supabase-js'
import { Pinecone } from '@pinecone-database/pinecone'

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase clients
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Pinecone Configuration
const pineconeApiKey = process.env.PINECONE_API_KEY!
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT!
const pineconeIndexName = process.env.PINECONE_INDEX_NAME || 'cardology-context'

// Initialize Pinecone
export const pinecone = new Pinecone({
  apiKey: pineconeApiKey,
  environment: pineconeEnvironment
})

export const pineconeIndex = pinecone.index(pineconeIndexName)

// Database Types
export interface Document {
  id: string
  app_type: 'lcc' | 'dyk' | 'mbdc'
  content_type: 'book' | 'csv' | 'framework' | 'prompt'
  title: string
  content: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  access_level: 'private' | 'restricted'
  user_id?: string
}

export interface ContextChunk {
  id: string
  document_id: string
  app_type: 'lcc' | 'dyk' | 'mbdc'
  content_chunk: string
  embedding_id: string // Pinecone vector ID
  tags: string[]
  created_at: string
}

export interface AppContext {
  app_type: 'lcc' | 'dyk' | 'mbdc'
  tone: string
  focus_areas: string[]
  personality_traits: string[]
}

// App-specific configurations
export const APP_CONFIGS: Record<string, AppContext> = {
  lcc: {
    app_type: 'lcc',
    tone: 'spiritually aligned, witty, relatable, unapologetically honest',
    focus_areas: ['compatibility', 'dating patterns', 'red/green flags', 'love languages', 'relationship cycles'],
    personality_traits: ['soulful', 'grounded', 'witty', 'entertaining', 'calling out in love']
  },
  dyk: {
    app_type: 'dyk',
    tone: 'compassionate, warm, grounded, emotionally attuned',
    focus_areas: ['parenting guidance', 'emotional development', 'energetic alignment', 'childhood needs'],
    personality_traits: ['wise', 'parenting coach', 'cosmic insight', 'real-life wisdom']
  },
  mbdc: {
    app_type: 'mbdc',
    tone: 'purpose-driven, grounded clarity, sharp wit, million-dollar mindset',
    focus_areas: ['business alignment', 'purpose', 'growth cycles', 'timing', 'offers', 'mindset'],
    personality_traits: ['strategic', 'entrepreneurial', 'growth-focused', 'actionable']
  }
}

// Error handling
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ContextError extends Error {
  constructor(message: string, public appType?: string) {
    super(message)
    this.name = 'ContextError'
  }
}
