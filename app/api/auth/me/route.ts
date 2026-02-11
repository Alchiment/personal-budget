/**
 * User Profile Endpoint (Protected)
 * GET /api/auth/me
 * 
 * Returns the current user's profile information
 * Protected endpoint - requires valid JWT access token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentTenantClient } from '@/app/lib/db';
import { AuthService } from '@/app/lib/auth/auth.service';
import { AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';
import { verifyAccessToken, extractTokenFromHeader } from '@/app/lib/auth/jwt';

export async function GET(request: NextRequest) {
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

    // Get tenant-specific client
    const tenantClient = getCurrentTenantClient();

    // Initialize auth service
    const authService = new AuthService(tenantClient);

    // Get user info
    const user = await authService.getUserById(payload.userId);

    if (!user) {
      return NextResponse.json(
        new AuthErrorResponseDTO('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user profile';
    return NextResponse.json(new AuthErrorResponseDTO('ERROR', message), { status: 400 });
  }
}
