/**
 * Logout Endpoint
 * POST /api/auth/logout
 * 
 * Logs out a user by invalidating their refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { AuthService } from '@/app/lib/auth/auth.service';
import { AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';
import { verifyAccessToken, extractTokenFromHeader } from '@/app/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(request.headers.get('authorization'));

    if (!token) {
      return NextResponse.json(
        new AuthErrorResponseDTO('UNAUTHORIZED', 'Missing authorization token'),
        { status: 401 }
      );
    }

    // Verify token and extract user ID
    const payload = verifyAccessToken(token);

    // Initialize auth service
    const authService = new AuthService(getClient());

    // Perform logout
    await authService.logout(payload.userId);

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return NextResponse.json(new AuthErrorResponseDTO('LOGOUT_ERROR', message), { status: 400 });
  }
}
