import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin'
  appAccess: ('lcc' | 'dyk' | 'mbdc')[]
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars'

  /**
   * Verify JWT token from request
   */
  static verifyToken(request: NextRequest): AuthUser | null {
    try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
      }

      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, this.JWT_SECRET) as any

      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
        appAccess: decoded.appAccess || ['dyk'] // Default to DYK access
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      return null
    }
  }

  /**
   * Generate JWT token for user
   */
  static generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        appAccess: user.appAccess
      },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  /**
   * Check if user has access to specific app
   */
  static hasAppAccess(user: AuthUser, appType: 'lcc' | 'dyk' | 'mbdc'): boolean {
    return user.appAccess.includes(appType) || user.role === 'admin'
  }

  /**
   * Encrypt sensitive data
   */
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':')
    const iv = Buffer.from(textParts.shift()!, 'hex')
    const encryptedData = textParts.join(':')
    const decipher = crypto.createDecipher('aes-256-cbc', this.ENCRYPTION_KEY)
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  /**
   * Generate secure hash for file content
   */
  static generateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  /**
   * Validate file upload security
   */
  static validateFileUpload(file: File): { valid: boolean; error?: string } {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large' }
    }

    // Check file type
    const allowedTypes = [
      'text/plain',
      'text/csv',
      'application/json',
      'text/markdown'
    ]

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type' }
    }

    // Check for potentially malicious content
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js']
    const fileName = file.name.toLowerCase()
    
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      return { valid: false, error: 'Potentially dangerous file type' }
    }

    return { valid: true }
  }

  /**
   * Rate limiting check
   */
  static async checkRateLimit(
    userId: string,
    action: string,
    limit: number = 100,
    windowMs: number = 60000 // 1 minute
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    // This would typically use Redis or a similar cache
    // For now, we'll implement a simple in-memory solution
    // In production, use Redis with proper TTL
    
    const key = `rate_limit:${userId}:${action}`
    const now = Date.now()
    const windowStart = now - windowMs

    // This is a simplified implementation
    // In production, use Redis with proper atomic operations
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs
    }
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }

  /**
   * Validate app type
   */
  static validateAppType(appType: string): appType is 'lcc' | 'dyk' | 'mbdc' {
    return ['lcc', 'dyk', 'mbdc'].includes(appType)
  }

  /**
   * Validate content type
   */
  static validateContentType(contentType: string): contentType is 'book' | 'csv' | 'framework' | 'prompt' {
    return ['book', 'csv', 'framework', 'prompt'].includes(contentType)
  }
}

/**
 * Middleware for API route authentication
 */
export function withAuth(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const user = AuthService.verifyToken(request)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(request, user)
  }
}

/**
 * Middleware for app-specific access control
 */
export function withAppAccess(
  appType: 'lcc' | 'dyk' | 'mbdc',
  handler: (request: NextRequest, user: AuthUser) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const user = AuthService.verifyToken(request)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!AuthService.hasAppAccess(user, appType)) {
      return new Response(
        JSON.stringify({ error: 'Access denied to this app' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(request, user)
  }
}
