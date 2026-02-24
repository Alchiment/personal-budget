/**
 * Resolves the authenticated user from an incoming API request.
 * Supports both:
 *  - Authorization: Bearer <token> header (client-side fetch)
 *  - accessToken cookie (server-component or browser requests)
 */

import { NextRequest } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from './jwt';

export function resolveUser(request: NextRequest): JWTPayload {
  // 1. Try Authorization header
  const headerToken = extractTokenFromHeader(request.headers.get('authorization'));
  if (headerToken) {
    return verifyAccessToken(headerToken);
  }

  // 2. Fall back to cookie
  const cookieToken = request.cookies.get('accessToken')?.value;
  if (cookieToken) {
    return verifyAccessToken(cookieToken);
  }

  throw new Error('Missing authorization token');
}
