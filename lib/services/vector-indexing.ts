import { pineconeIndex, supabaseAdmin, ContextChunk, DatabaseError } from '../database/config'
import { DocumentStorageService } from './document-storage'

export class VectorIndexingService {
  private static readonly CHUNK_SIZE = 1000 // Characters per chunk
  private static readonly CHUNK_OVERLAP = 200 // Overlap between chunks
  private static readonly EMBEDDING_DIMENSION = 1536 // OpenAI embedding dimension

  /**
   * Process a document and create vector embeddings
   */
  static async processDocument(documentId: string, userId: string): Promise<void> {
    try {
      // Get the document
      const document = await DocumentStorageService.getDocument(documentId, userId)
      if (!document) {
        throw new DatabaseError('Document not found', 'NOT_FOUND')
      }

      // Update status to processing
      await DocumentStorageService.updateProcessingStatus(documentId, 'processing')

      // Split content into chunks
      const chunks = this.splitIntoChunks(document.content, document.title)
      
      // Create embeddings for each chunk
      const embeddings = await this.createEmbeddings(chunks)

      // Store chunks in database and vectors in Pinecone
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const embedding = embeddings[i]
        
        // Generate unique vector ID
        const vectorId = `${documentId}_chunk_${i}`
        
        // Store in Pinecone
        await pineconeIndex.upsert([{
          id: vectorId,
          values: embedding,
          metadata: {
            document_id: documentId,
            app_type: document.app_type,
            content_type: document.content_type,
            chunk_index: i,
            title: document.title
          }
        }])

        // Store chunk in database
        const { error } = await supabaseAdmin
          .from('context_chunks')
          .insert({
            document_id: documentId,
            app_type: document.app_type,
            content_chunk: chunk,
            embedding_id: vectorId,
            chunk_index: i,
            tags: this.extractTags(chunk, document.app_type)
          })

        if (error) {
          throw new DatabaseError(`Failed to store context chunk: ${error.message}`, error.code)
        }
      }

      // Update status to completed
      await DocumentStorageService.updateProcessingStatus(documentId, 'completed', {
        chunks_created: chunks.length,
        processed_at: new Date().toISOString()
      })

    } catch (error) {
      // Update status to failed
      await DocumentStorageService.updateProcessingStatus(documentId, 'failed', {
        error: error.message,
        failed_at: new Date().toISOString()
      })
      
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error processing document: ${error.message}`)
    }
  }

  /**
   * Search for relevant context using semantic similarity
   */
  static async searchContext(
    query: string,
    appType: 'lcc' | 'dyk' | 'mbdc',
    userId: string,
    limit: number = 5
  ): Promise<ContextChunk[]> {
    try {
      // Create embedding for the query
      const queryEmbedding = await this.createEmbeddings([query])
      
      // Search in Pinecone
      const searchResponse = await pineconeIndex.query({
        vector: queryEmbedding[0],
        topK: limit * 2, // Get more results to filter by user
        includeMetadata: true,
        filter: {
          app_type: { $eq: appType }
        }
      })

      // Get document IDs from search results
      const documentIds = searchResponse.matches?.map(match => 
        match.metadata?.document_id
      ).filter(Boolean) || []

      if (documentIds.length === 0) {
        return []
      }

      // Verify user has access to these documents and get chunks
      const { data, error } = await supabaseAdmin
        .from('context_chunks')
        .select(`
          *,
          documents!inner(user_id)
        `)
        .in('document_id', documentIds)
        .in('embedding_id', searchResponse.matches?.map(m => m.id) || [])
        .eq('app_type', appType)
        .eq('documents.user_id', userId)
        .order('chunk_index')
        .limit(limit)

      if (error) {
        throw new DatabaseError(`Failed to retrieve context chunks: ${error.message}`, error.code)
      }

      return data as ContextChunk[]
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error searching context: ${error.message}`)
    }
  }

  /**
   * Delete all vectors and chunks for a document
   */
  static async deleteDocumentVectors(documentId: string): Promise<void> {
    try {
      // Get all chunk IDs for this document
      const { data: chunks, error: chunksError } = await supabaseAdmin
        .from('context_chunks')
        .select('embedding_id')
        .eq('document_id', documentId)

      if (chunksError) {
        throw new DatabaseError(`Failed to get chunks for deletion: ${chunksError.message}`, chunksError.code)
      }

      if (chunks && chunks.length > 0) {
        // Delete from Pinecone
        const vectorIds = chunks.map(chunk => chunk.embedding_id)
        await pineconeIndex.deleteMany(vectorIds)
      }

      // Delete chunks from database
      const { error } = await supabaseAdmin
        .from('context_chunks')
        .delete()
        .eq('document_id', documentId)

      if (error) {
        throw new DatabaseError(`Failed to delete context chunks: ${error.message}`, error.code)
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error deleting document vectors: ${error.message}`)
    }
  }

  /**
   * Split content into overlapping chunks
   */
  private static splitIntoChunks(content: string, title: string): string[] {
    const chunks: string[] = []
    let start = 0

    while (start < content.length) {
      const end = Math.min(start + this.CHUNK_SIZE, content.length)
      let chunk = content.slice(start, end)

      // Try to break at sentence boundaries
      if (end < content.length) {
        const lastSentence = chunk.lastIndexOf('.')
        const lastParagraph = chunk.lastIndexOf('\n\n')
        const breakPoint = Math.max(lastSentence, lastParagraph)
        
        if (breakPoint > start + this.CHUNK_SIZE * 0.5) {
          chunk = content.slice(start, start + breakPoint + 1)
        }
      }

      // Add title context to each chunk
      chunks.push(`Title: ${title}\n\n${chunk.trim()}`)
      
      // Move start position with overlap
      start = start + chunk.length - this.CHUNK_OVERLAP
    }

    return chunks
  }

  /**
   * Create embeddings using OpenAI API
   */
  private static async createEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: texts,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data.map((item: any) => item.embedding)
    } catch (error) {
      throw new Error(`Failed to create embeddings: ${error.message}`)
    }
  }

  /**
   * Extract relevant tags from content based on app type
   */
  private static extractTags(content: string, appType: 'lcc' | 'dyk' | 'mbdc'): string[] {
    const tags: string[] = []
    const lowerContent = content.toLowerCase()

    // App-specific keyword extraction
    const keywordMaps = {
      lcc: {
        'relationship': ['love', 'relationship', 'partner', 'dating', 'romance', 'compatibility'],
        'emotions': ['emotions', 'feelings', 'heart', 'passion', 'intimacy'],
        'communication': ['communication', 'talking', 'listening', 'understanding'],
        'cycles': ['cycle', 'pattern', 'phase', 'timing', 'season']
      },
      dyk: {
        'development': ['development', 'growth', 'learning', 'milestone', 'stage'],
        'behavior': ['behavior', 'acting', 'mood', 'temperament', 'personality'],
        'needs': ['needs', 'support', 'guidance', 'help', 'care'],
        'activities': ['activities', 'play', 'games', 'learning', 'creativity']
      },
      mbdc: {
        'business': ['business', 'entrepreneur', 'company', 'startup', 'venture'],
        'money': ['money', 'income', 'revenue', 'profit', 'wealth', 'financial'],
        'strategy': ['strategy', 'planning', 'goals', 'vision', 'mission'],
        'timing': ['timing', 'opportunity', 'moment', 'cycle', 'season']
      }
    }

    const appKeywords = keywordMaps[appType]
    for (const [category, keywords] of Object.entries(appKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        tags.push(category)
      }
    }

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Get indexing statistics
   */
  static async getIndexingStats(userId: string): Promise<{
    totalChunks: number
    totalVectors: number
    byAppType: Record<string, number>
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('context_chunks')
        .select(`
          app_type,
          documents!inner(user_id)
        `)
        .eq('documents.user_id', userId)

      if (error) {
        throw new DatabaseError(`Failed to get indexing stats: ${error.message}`, error.code)
      }

      const stats = {
        totalChunks: data.length,
        totalVectors: data.length, // Same as chunks
        byAppType: {} as Record<string, number>
      }

      data.forEach(chunk => {
        stats.byAppType[chunk.app_type] = (stats.byAppType[chunk.app_type] || 0) + 1
      })

      return stats
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error getting indexing stats: ${error.message}`)
    }
  }
}
