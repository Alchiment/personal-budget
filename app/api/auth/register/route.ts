/**
 * Register Endpoint
 * POST /api/auth/register
 * 
 * Registers a new user and returns JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentTenantClient } from '@/app/lib/db';
import { AuthService } from '@/app/lib/auth/auth.service';
import { RegisterRequestDTO, AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const { email, password, name } = body;
    if (!email || !password) {
      return NextResponse.json(
        new AuthErrorResponseDTO('VALIDATION_ERROR', 'Email and password are required'),
        { status: 400 }
      );
    }

    // Create DTO
    const registerDto = new RegisterRequestDTO({ email, password, name });

    // Get tenant-specific client
    const tenantClient = getCurrentTenantClient();

    // Initialize auth service
    const authService = new AuthService(tenantClient);

    // Perform registration
    const response = await authService.register(registerDto.email, registerDto.password, registerDto.name);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(new AuthErrorResponseDTO('REGISTRATION_ERROR', message), { status: 400 });
  }
}
