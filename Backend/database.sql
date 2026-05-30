-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table with embeddings
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(768),
  created_at TIMESTAMP DEFAULT NOW()
);
SELECT * From document_metadata
SELECT * From chat_history
-- Document metadata table
CREATE TABLE IF NOT EXISTS document_metadata (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  schema TEXT
);

-- Document rows for structured data
CREATE TABLE IF NOT EXISTS document_rows (
  id SERIAL PRIMARY KEY,
  dataset_id TEXT REFERENCES document_metadata(id) ON DELETE CASCADE,
  row_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id BIGSERIAL PRIMARY KEY,
  document_id TEXT REFERENCES document_metadata(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function to match documents by embedding similarity
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(768),
  match_count INT DEFAULT 5,
  filter JSONB DEFAULT '{}'
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE documents.metadata @> filter
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_documents_metadata ON documents USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_document_rows_dataset ON document_rows(dataset_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_document ON chat_history(document_id);