import { NextRequest, NextResponse } from 'next/server'
import { ContextManagerService } from '@/lib/services/context-manager'
import { DocumentStorageService } from '@/lib/services/document-storage'
import { VectorIndexingService } from '@/lib/services/vector-indexing'
import { ContextError, DatabaseError } from '@/lib/database/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      query,
      appType,
      userId,
      userContext
    } = body

    // Validate required fields
    if (!query || !appType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: query, appType, userId' },
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

    // Generate contextual response
    const contextualResponse = await ContextManagerService.generateContextualResponse(
      query,
      appType,
      userId,
      userContext
    )

    // Log the interaction
    await ContextManagerService.logInteraction(
      userId,
      appType,
      query,
      contextualResponse.context.length,
      contextualResponse.relevantChunks.map(chunk => chunk.id)
    )

    return NextResponse.json({
      success: true,
      response: contextualResponse
    })

  } catch (error) {
    console.error('Context generation error:', error)
    
    if (error instanceof ContextError || error instanceof DatabaseError) {
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
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'stats':
        const [docStats, contextStats, indexingStats] = await Promise.all([
          DocumentStorageService.getDocumentStats(userId),
          ContextManagerService.getContextStats(userId),
          VectorIndexingService.getIndexingStats(userId)
        ])

        return NextResponse.json({
          success: true,
          stats: {
            documents: docStats,
            context: contextStats,
            indexing: indexingStats
          }
        })

      case 'session':
        if (!appType) {
          return NextResponse.json(
            { error: 'App type is required for session data' },
            { status: 400 }
          )
        }

        const session = await ContextManagerService.getUserSession(
          userId,
          appType as 'lcc' | 'dyk' | 'mbdc'
        )

        return NextResponse.json({
          success: true,
          session
        })

      case 'app-config':
        if (!appType) {
          return NextResponse.json(
            { error: 'App type is required for app config' },
            { status: 400 }
          )
        }

        const appContext = await ContextManagerService.getAppContext(
          appType as 'lcc' | 'dyk' | 'mbdc'
        )

        return NextResponse.json({
          success: true,
          appContext
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Valid actions: stats, session, app-config' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Context API error:', error)
    
    if (error instanceof ContextError || error instanceof DatabaseError) {
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      appType,
      sessionData
    } = body

    // Validate required fields
    if (!userId || !appType || !sessionData) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, appType, sessionData' },
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

    // Update user session
    await ContextManagerService.updateUserSession(
      userId,
      appType,
      sessionData
    )

    return NextResponse.json({
      success: true,
      message: 'Session updated successfully'
    })

  } catch (error) {
    console.error('Session update error:', error)
    
    if (error instanceof ContextError) {
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
