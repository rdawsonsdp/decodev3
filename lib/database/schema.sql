-- Cardology Context Management Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Documents table for storing proprietary materials
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_type VARCHAR(20) NOT NULL CHECK (app_type IN ('lcc', 'dyk', 'mbdc')),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('book', 'csv', 'framework', 'prompt')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_level VARCHAR(20) DEFAULT 'private' CHECK (access_level IN ('private', 'restricted')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_size INTEGER,
    file_hash VARCHAR(64) UNIQUE, -- SHA-256 hash for duplicate detection
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Context chunks for semantic search
CREATE TABLE context_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    app_type VARCHAR(20) NOT NULL CHECK (app_type IN ('lcc', 'dyk', 'mbdc')),
    content_chunk TEXT NOT NULL,
    embedding_id VARCHAR(255) UNIQUE, -- Pinecone vector ID
    chunk_index INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- App-specific context configurations
CREATE TABLE app_contexts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_type VARCHAR(20) UNIQUE NOT NULL CHECK (app_type IN ('lcc', 'dyk', 'mbdc')),
    tone VARCHAR(500) NOT NULL,
    focus_areas TEXT[] NOT NULL,
    personality_traits TEXT[] NOT NULL,
    system_prompts JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for tracking app usage
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    app_type VARCHAR(20) NOT NULL CHECK (app_type IN ('lcc', 'dyk', 'mbdc')),
    session_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for document access
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    app_type VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_documents_app_type ON documents(app_type);
CREATE INDEX idx_documents_content_type ON documents(content_type);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_file_hash ON documents(file_hash);

CREATE INDEX idx_context_chunks_document_id ON context_chunks(document_id);
CREATE INDEX idx_context_chunks_app_type ON context_chunks(app_type);
CREATE INDEX idx_context_chunks_embedding_id ON context_chunks(embedding_id);
CREATE INDEX idx_context_chunks_tags ON context_chunks USING GIN(tags);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_app_type ON user_sessions(app_type);
CREATE INDEX idx_user_sessions_last_accessed ON user_sessions(last_accessed);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Documents: Only authenticated users can access their own documents
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Context chunks: Accessible based on document ownership
CREATE POLICY "Users can view context chunks for their documents" ON context_chunks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = context_chunks.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- User sessions: Users can only access their own sessions
CREATE POLICY "Users can manage their own sessions" ON user_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Audit log: Read-only for users, full access for service role
CREATE POLICY "Users can view their own audit logs" ON audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_contexts_updated_at BEFORE UPDATE ON app_contexts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log document access
CREATE OR REPLACE FUNCTION log_document_access(
    p_user_id UUID,
    p_action VARCHAR(50),
    p_resource_type VARCHAR(50),
    p_resource_id UUID,
    p_app_type VARCHAR(20),
    p_metadata JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_log (
        user_id, action, resource_type, resource_id, 
        app_type, metadata, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id,
        p_app_type, p_metadata, p_ip_address, p_user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default app contexts
INSERT INTO app_contexts (app_type, tone, focus_areas, personality_traits, system_prompts) VALUES
('lcc', 'spiritually aligned, witty, relatable, unapologetically honest', 
 ARRAY['compatibility', 'dating patterns', 'red/green flags', 'love languages', 'relationship cycles'],
 ARRAY['soulful', 'grounded', 'witty', 'entertaining', 'calling out in love'],
 '{"system_prompt": "You are a spiritually aligned Cardology-based love coach..."}'),

('dyk', 'compassionate, warm, grounded, emotionally attuned',
 ARRAY['parenting guidance', 'emotional development', 'energetic alignment', 'childhood needs'],
 ARRAY['wise', 'parenting coach', 'cosmic insight', 'real-life wisdom'],
 '{"system_prompt": "You are a compassionate Cardology-based parenting guide..."}'),

('mbdc', 'purpose-driven, grounded clarity, sharp wit, million-dollar mindset',
 ARRAY['business alignment', 'purpose', 'growth cycles', 'timing', 'offers', 'mindset'],
 ARRAY['strategic', 'entrepreneurial', 'growth-focused', 'actionable'],
 '{"system_prompt": "You are a purpose-driven business strategist who uses Cardology..."}');
