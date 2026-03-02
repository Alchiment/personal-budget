/**
 * Resolves the authenticated user from an incoming API request.
 * Supports both:
 *  - Authorization: Bearer <token> header (client-side fetch)
 *  - accessToken cookie (server-component or browser requests)
 */

import { NextRequest } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from './jwt';

export function resolveUser(request: NextRequest): JWTPayload {
  let token = extractTokenFromHeader(request.headers.get('authorization'));
  
  if (!token) {
    token = request.cookies.get('accessToken')?.value ?? null;
  }

  if (!token) {
    throw new Error('Missing authorization token');
  }

  return verifyAccessToken(token);
}
