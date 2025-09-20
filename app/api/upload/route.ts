import { NextRequest, NextResponse } from 'next/server'
import { DocumentStorageService } from '@/lib/services/document-storage'
import { VectorIndexingService } from '@/lib/services/vector-indexing'
import { DatabaseError } from '@/lib/database/config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const appType = formData.get('appType') as string
    const contentType = formData.get('contentType') as string
    const title = formData.get('title') as string
    const userId = formData.get('userId') as string

    // Validate required fields
    if (!file || !appType || !contentType || !title || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate app type
    if (!['lcc', 'dyk', 'mbdc'].includes(appType)) {
      return NextResponse.json(
        { error: 'Invalid app type' },
        { status: 400 }
      )
    }

    // Validate content type
    if (!['book', 'csv', 'framework', 'prompt'].includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'text/csv',
      'application/pdf',
      'application/json',
      'text/markdown'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: txt, csv, pdf, json, md' },
        { status: 400 }
      )
    }

    // Read file content
    let content: string
    try {
      if (file.type === 'application/pdf') {
        // For PDF files, you'd need a PDF parser like pdf-parse
        // For now, we'll return an error
        return NextResponse.json(
          { error: 'PDF processing not yet implemented' },
          { status: 501 }
        )
      } else {
        content = await file.text()
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read file content' },
        { status: 400 }
      )
    }

    // Store document in database
    const document = await DocumentStorageService.storeDocument(
      appType as 'lcc' | 'dyk' | 'mbdc',
      contentType as 'book' | 'csv' | 'framework' | 'prompt',
      title,
      content,
      userId,
      {
        original_filename: file.name,
        file_size: file.size,
        file_type: file.type,
        uploaded_at: new Date().toISOString()
      }
    )

    // Start processing in background (don't await)
    VectorIndexingService.processDocument(document.id, userId)
      .catch(error => {
        console.error('Background processing failed:', error)
      })

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        app_type: document.app_type,
        content_type: document.content_type,
        processing_status: document.processing_status,
        created_at: document.created_at
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const appType = searchParams.get('appType')
    const contentType = searchParams.get('contentType')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const documents = await DocumentStorageService.listDocuments(
      userId,
      appType as 'lcc' | 'dyk' | 'mbdc' | undefined,
      contentType as 'book' | 'csv' | 'framework' | 'prompt' | undefined
    )

    return NextResponse.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        app_type: doc.app_type,
        content_type: doc.content_type,
        processing_status: doc.processing_status,
        file_size: doc.file_size,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }))
    })

  } catch (error) {
    console.error('List documents error:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    const userId = searchParams.get('userId')

    if (!documentId || !userId) {
      return NextResponse.json(
        { error: 'Document ID and User ID are required' },
        { status: 400 }
      )
    }

    // Delete document and its vectors
    await DocumentStorageService.deleteDocument(documentId, userId)
    await VectorIndexingService.deleteDocumentVectors(documentId)

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('Delete document error:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
