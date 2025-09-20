import { supabaseAdmin, APP_CONFIGS, AppContext, ContextError } from '../database/config'
import { VectorIndexingService } from './vector-indexing'
import { DocumentStorageService } from './document-storage'

export interface ContextualResponse {
  appType: 'lcc' | 'dyk' | 'mbdc'
  context: string
  tone: string
  personalityTraits: string[]
  focusAreas: string[]
  relevantChunks: any[]
  systemPrompt: string
}

export class ContextManagerService {
  /**
   * Get app-specific context and configuration
   */
  static async getAppContext(appType: 'lcc' | 'dyk' | 'mbdc'): Promise<AppContext> {
    try {
      const { data, error } = await supabaseAdmin
        .from('app_contexts')
        .select('*')
        .eq('app_type', appType)
        .single()

      if (error) {
        // Fallback to default config if not found in database
        return APP_CONFIGS[appType]
      }

      return {
        app_type: data.app_type,
        tone: data.tone,
        focus_areas: data.focus_areas,
        personality_traits: data.personality_traits
      }
    } catch (error) {
      throw new ContextError(`Failed to get app context: ${error.message}`, appType)
    }
  }

  /**
   * Generate contextual response with app-specific personality
   */
  static async generateContextualResponse(
    query: string,
    appType: 'lcc' | 'dyk' | 'mbdc',
    userId: string,
    userContext?: {
      birthCard?: string
      yearlyCard?: string
      planetaryCards?: string[]
      additionalContext?: Record<string, any>
    }
  ): Promise<ContextualResponse> {
    try {
      // Get app configuration
      const appContext = await this.getAppContext(appType)
      
      // Search for relevant context chunks
      const relevantChunks = await VectorIndexingService.searchContext(
        query,
        appType,
        userId,
        5
      )

      // Build context string from relevant chunks
      const contextString = this.buildContextString(relevantChunks, userContext)
      
      // Generate system prompt
      const systemPrompt = this.generateSystemPrompt(appContext, userContext)

      return {
        appType,
        context: contextString,
        tone: appContext.tone,
        personalityTraits: appContext.personality_traits,
        focusAreas: appContext.focus_areas,
        relevantChunks,
        systemPrompt
      }
    } catch (error) {
      throw new ContextError(`Failed to generate contextual response: ${error.message}`, appType)
    }
  }

  /**
   * Build context string from relevant chunks and user context
   */
  private static buildContextString(
    chunks: any[],
    userContext?: {
      birthCard?: string
      yearlyCard?: string
      planetaryCards?: string[]
      additionalContext?: Record<string, any>
    }
  ): string {
    let contextString = ''

    // Add user's card context if available
    if (userContext) {
      if (userContext.birthCard) {
        contextString += `User's Birth Card: ${userContext.birthCard}\n\n`
      }
      if (userContext.yearlyCard) {
        contextString += `User's Yearly Card: ${userContext.yearlyCard}\n\n`
      }
      if (userContext.planetaryCards && userContext.planetaryCards.length > 0) {
        contextString += `User's Planetary Cards: ${userContext.planetaryCards.join(', ')}\n\n`
      }
    }

    // Add relevant content chunks
    if (chunks.length > 0) {
      contextString += 'Relevant Context from Proprietary Materials:\n\n'
      chunks.forEach((chunk, index) => {
        contextString += `${index + 1}. ${chunk.content_chunk}\n\n`
      })
    }

    return contextString.trim()
  }

  /**
   * Generate system prompt based on app context and user information
   */
  private static generateSystemPrompt(
    appContext: AppContext,
    userContext?: {
      birthCard?: string
      yearlyCard?: string
      planetaryCards?: string[]
      additionalContext?: Record<string, any>
    }
  ): string {
    const basePrompts = {
      lcc: `You are a spiritually aligned Cardology-based love coach. Use the querent's birth card, yearly card, planetary cards, composite information and uploaded information to answer questions. Respond with soulful, grounded wisdom wrapped in wit. Be witty, relatable, and unapologetically honest. Imagine you're breaking down the essence of the information or concept, blending humor with insight while keeping it grounded in truth. Your goal is to make the reader feel seen, educated, entertained, and maybe even a little called out (in a loving way). Get personal, but keep it conversational. Focus on: ${appContext.focus_areas.join(', ')}.`,

      dyk: `You are a compassionate Cardology-based parenting guide. Use the child's birth cards, yearly and planetary spreads, planetary cycles, and uploaded cardology knowledge to answer questions about their behavior, needs, and gifts. Ground your insights in the emotional intent of the reading. Speak in a warm, grounded, emotionally attuned tone—like a wise parenting coach who blends real-life wisdom with cosmic insight. Focus on: ${appContext.focus_areas.join(', ')}.`,

      mbdc: `You are a purpose-driven business strategist who uses Cardology to guide entrepreneurs. Use birth cards, yearly and planetary cards, planetary cycles, and uploaded cardology knowledge to offer actionable insight into growth, alignment, and income potential. Speak with grounded clarity, sharp wit, and the energy of a million-dollar mindset. Focus on: ${appContext.focus_areas.join(', ')}.`
    }

    let systemPrompt = basePrompts[appContext.app_type]

    // Add user-specific context if available
    if (userContext) {
      systemPrompt += '\n\nUser Context:'
      if (userContext.birthCard) {
        systemPrompt += `\n- Birth Card: ${userContext.birthCard}`
      }
      if (userContext.yearlyCard) {
        systemPrompt += `\n- Yearly Card: ${userContext.yearlyCard}`
      }
      if (userContext.planetaryCards && userContext.planetaryCards.length > 0) {
        systemPrompt += `\n- Planetary Cards: ${userContext.planetaryCards.join(', ')}`
      }
    }

    systemPrompt += '\n\nIMPORTANT: Use the uploaded proprietary materials to enhance your understanding, but never quote, summarize, or directly reference them. They exist solely to sharpen your responses behind the scenes. All responses must be original and tailored to the user\'s specific situation.'

    return systemPrompt
  }

  /**
   * Log user interaction for context tracking
   */
  static async logInteraction(
    userId: string,
    appType: 'lcc' | 'dyk' | 'mbdc',
    query: string,
    responseLength: number,
    contextUsed: string[]
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('audit_log')
        .insert({
          user_id: userId,
          action: 'context_query',
          resource_type: 'context',
          app_type: appType,
          metadata: {
            query_length: query.length,
            response_length: responseLength,
            context_chunks_used: contextUsed.length,
            context_chunk_ids: contextUsed
          }
        })

      if (error) {
        console.error('Failed to log interaction:', error)
        // Don't throw error for logging failures
      }
    } catch (error) {
      console.error('Unexpected error logging interaction:', error)
      // Don't throw error for logging failures
    }
  }

  /**
   * Get user's session context for an app
   */
  static async getUserSession(
    userId: string,
    appType: 'lcc' | 'dyk' | 'mbdc'
  ): Promise<any> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('app_type', appType)
        .order('last_accessed', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new ContextError(`Failed to get user session: ${error.message}`, appType)
      }

      return data
    } catch (error) {
      if (error instanceof ContextError) {
        throw error
      }
      throw new ContextError(`Unexpected error getting user session: ${error.message}`, appType)
    }
  }

  /**
   * Update user's session context
   */
  static async updateUserSession(
    userId: string,
    appType: 'lcc' | 'dyk' | 'mbdc',
    sessionData: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('user_sessions')
        .upsert({
          user_id: userId,
          app_type: appType,
          session_data: sessionData,
          last_accessed: new Date().toISOString()
        })

      if (error) {
        throw new ContextError(`Failed to update user session: ${error.message}`, appType)
      }
    } catch (error) {
      if (error instanceof ContextError) {
        throw error
      }
      throw new ContextError(`Unexpected error updating user session: ${error.message}`, appType)
    }
  }

  /**
   * Get context statistics for a user
   */
  static async getContextStats(userId: string): Promise<{
    totalInteractions: number
    byAppType: Record<string, number>
    averageResponseLength: number
    mostUsedContext: string[]
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('audit_log')
        .select('app_type, metadata')
        .eq('user_id', userId)
        .eq('action', 'context_query')

      if (error) {
        throw new ContextError(`Failed to get context stats: ${error.message}`)
      }

      const stats = {
        totalInteractions: data.length,
        byAppType: {} as Record<string, number>,
        averageResponseLength: 0,
        mostUsedContext: [] as string[]
      }

      let totalResponseLength = 0
      const contextUsage: Record<string, number> = {}

      data.forEach(log => {
        // Count by app type
        stats.byAppType[log.app_type] = (stats.byAppType[log.app_type] || 0) + 1
        
        // Sum response lengths
        if (log.metadata?.response_length) {
          totalResponseLength += log.metadata.response_length
        }

        // Track context usage
        if (log.metadata?.context_chunk_ids) {
          log.metadata.context_chunk_ids.forEach((id: string) => {
            contextUsage[id] = (contextUsage[id] || 0) + 1
          })
        }
      })

      stats.averageResponseLength = data.length > 0 ? totalResponseLength / data.length : 0
      stats.mostUsedContext = Object.entries(contextUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([id]) => id)

      return stats
    } catch (error) {
      if (error instanceof ContextError) {
        throw error
      }
      throw new ContextError(`Unexpected error getting context stats: ${error.message}`)
    }
  }
}
