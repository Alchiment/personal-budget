/**
 * Logout Endpoint
 * POST /api/auth/logout
 * 
 * Logs out a user by invalidating their refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { AuthService } from '@/app/pages/auth/services/auth.service';
import { AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';
import { verifyAccessToken, extractTokenFromHeader } from '@/app/lib/auth/jwt';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  response.cookies.set('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        const authService = new AuthService(getClient());
        await authService.logout(payload.userId);
      } catch {
        // Token invalid or expired, but we still clear cookies
      }
    }

    return response;
  } catch (error) {
    return response;
  }
}
