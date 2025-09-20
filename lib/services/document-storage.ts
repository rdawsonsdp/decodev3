import { supabaseAdmin, Document, DatabaseError } from '../database/config'
import crypto from 'crypto'

export class DocumentStorageService {
  /**
   * Store a document in the database
   */
  static async storeDocument(
    appType: 'lcc' | 'dyk' | 'mbdc',
    contentType: 'book' | 'csv' | 'framework' | 'prompt',
    title: string,
    content: string,
    userId: string,
    metadata: Record<string, any> = {}
  ): Promise<Document> {
    try {
      // Generate content hash for duplicate detection
      const contentHash = crypto
        .createHash('sha256')
        .update(content)
        .digest('hex')

      // Check for existing document with same hash
      const { data: existingDoc } = await supabaseAdmin
        .from('documents')
        .select('*')
        .eq('file_hash', contentHash)
        .single()

      if (existingDoc) {
        throw new DatabaseError('Document with identical content already exists', 'DUPLICATE_CONTENT')
      }

      // Insert new document
      const { data, error } = await supabaseAdmin
        .from('documents')
        .insert({
          app_type: appType,
          content_type: contentType,
          title,
          content,
          metadata,
          user_id: userId,
          file_size: Buffer.byteLength(content, 'utf8'),
          file_hash: contentHash,
          processing_status: 'pending'
        })
        .select()
        .single()

      if (error) {
        throw new DatabaseError(`Failed to store document: ${error.message}`, error.code)
      }

      return data as Document
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error storing document: ${error.message}`)
    }
  }

  /**
   * Retrieve a document by ID
   */
  static async getDocument(documentId: string, userId: string): Promise<Document | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Document not found
        }
        throw new DatabaseError(`Failed to retrieve document: ${error.message}`, error.code)
      }

      return data as Document
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error retrieving document: ${error.message}`)
    }
  }

  /**
   * List documents for a user and app type
   */
  static async listDocuments(
    userId: string,
    appType?: 'lcc' | 'dyk' | 'mbdc',
    contentType?: 'book' | 'csv' | 'framework' | 'prompt'
  ): Promise<Document[]> {
    try {
      let query = supabaseAdmin
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (appType) {
        query = query.eq('app_type', appType)
      }

      if (contentType) {
        query = query.eq('content_type', contentType)
      }

      const { data, error } = await query

      if (error) {
        throw new DatabaseError(`Failed to list documents: ${error.message}`, error.code)
      }

      return data as Document[]
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error listing documents: ${error.message}`)
    }
  }

  /**
   * Update document processing status
   */
  static async updateProcessingStatus(
    documentId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const updateData: any = { processing_status: status }
      if (metadata) {
        updateData.metadata = metadata
      }

      const { error } = await supabaseAdmin
        .from('documents')
        .update(updateData)
        .eq('id', documentId)

      if (error) {
        throw new DatabaseError(`Failed to update processing status: ${error.message}`, error.code)
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error updating processing status: ${error.message}`)
    }
  }

  /**
   * Delete a document and its associated context chunks
   */
  static async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      // First, verify the document belongs to the user
      const document = await this.getDocument(documentId, userId)
      if (!document) {
        throw new DatabaseError('Document not found or access denied', 'NOT_FOUND')
      }

      // Delete context chunks first (foreign key constraint)
      const { error: chunksError } = await supabaseAdmin
        .from('context_chunks')
        .delete()
        .eq('document_id', documentId)

      if (chunksError) {
        throw new DatabaseError(`Failed to delete context chunks: ${chunksError.message}`, chunksError.code)
      }

      // Delete the document
      const { error } = await supabaseAdmin
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) {
        throw new DatabaseError(`Failed to delete document: ${error.message}`, error.code)
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error deleting document: ${error.message}`)
    }
  }

  /**
   * Get document statistics for a user
   */
  static async getDocumentStats(userId: string): Promise<{
    total: number
    byAppType: Record<string, number>
    byContentType: Record<string, number>
    totalSize: number
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('documents')
        .select('app_type, content_type, file_size')
        .eq('user_id', userId)

      if (error) {
        throw new DatabaseError(`Failed to get document stats: ${error.message}`, error.code)
      }

      const stats = {
        total: data.length,
        byAppType: {} as Record<string, number>,
        byContentType: {} as Record<string, number>,
        totalSize: 0
      }

      data.forEach(doc => {
        // Count by app type
        stats.byAppType[doc.app_type] = (stats.byAppType[doc.app_type] || 0) + 1
        
        // Count by content type
        stats.byContentType[doc.content_type] = (stats.byContentType[doc.content_type] || 0) + 1
        
        // Sum file sizes
        stats.totalSize += doc.file_size || 0
      })

      return stats
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Unexpected error getting document stats: ${error.message}`)
    }
  }
}
