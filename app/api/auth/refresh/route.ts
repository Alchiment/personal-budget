/**
 * Refresh Token Endpoint
 * POST /api/auth/refresh
 * 
 * Refreshes the access token using a valid refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { AuthService } from '@/app/lib/auth/auth.service';
import { RefreshTokenRequestDTO, AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';
import { verifyRefreshToken } from '@/app/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const { refreshToken } = body;
    if (!refreshToken) {
      return NextResponse.json(
        new AuthErrorResponseDTO('VALIDATION_ERROR', 'Refresh token is required'),
        { status: 400 }
      );
    }

    // Create DTO
    const refreshDto = new RefreshTokenRequestDTO({ refreshToken });

    // Verify refresh token and extract payload
    const payload = verifyRefreshToken(refreshDto.refreshToken);

    // Initialize auth service
    const authService = new AuthService(getClient());

    // Refresh access token
    const response = await authService.refreshAccessToken(payload.userId, refreshDto.refreshToken);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token refresh failed';
    return NextResponse.json(new AuthErrorResponseDTO('REFRESH_ERROR', message), { status: 401 });
  }
}
