/**
 * Login Endpoint
 * POST /api/auth/login
 * 
 * Authenticates a user and returns JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/app/lib/db';
import { AuthService } from '@/app/lib/auth/auth.service';
import { LoginRequestDTO, AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        new AuthErrorResponseDTO('VALIDATION_ERROR', 'Email and password are required'),
        { status: 400 }
      );
    }

    // Create DTO
    const loginDto = new LoginRequestDTO({ email, password });

    // Initialize auth service
    const authService = new AuthService(getClient());

    // Perform login
    const response = await authService.login(loginDto.email, loginDto.password);

    // Create response with cookies
    const nextResponse = NextResponse.json(response, { status: 200 });

    // Set cookies
    nextResponse.cookies.set('accessToken', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60, // 15 minutes, matches JWT expiry
      sameSite: 'lax',
    });

    nextResponse.cookies.set('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days, matches refresh expiry
      sameSite: 'lax',
    });

    return nextResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(new AuthErrorResponseDTO('LOGIN_ERROR', message), { status: 401 });
  }
}
