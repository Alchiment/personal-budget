/**
 * Authentication Middleware
 * Validates JWT tokens and extracts user information from requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from './jwt';
import { AuthenticatedRequest } from '@/app/pages/auth/dtos/authenticate-request.dto';

/**
 * Middleware to verify JWT access token
 * @param request - The incoming request
 * @returns Response with either success or error
 */
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      // Extract token from Authorization header
      const token = extractTokenFromHeader(request.headers.get('authorization'));

      if (!token) {
        return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Missing authorization token' }, { status: 401 });
      }

      // Verify token
      const payload = verifyAccessToken(token);

      // Attach user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = payload;

      return handler(authenticatedRequest);
    } catch (error) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: error instanceof Error ? error.message : 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Optional auth middleware - continues even if token is invalid
 * @param handler - The handler function
 * @returns Response with optional user info
 */
export function withOptionalAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      const token = extractTokenFromHeader(request.headers.get('authorization'));

      if (token) {
        const payload = verifyAccessToken(token);
        const authenticatedRequest = request as AuthenticatedRequest;
        authenticatedRequest.user = payload;
        return handler(authenticatedRequest);
      }

      return handler(request as AuthenticatedRequest);
    } catch (error) {
      // Continue without authentication on error
      return handler(request as AuthenticatedRequest);
    }
  };
}
