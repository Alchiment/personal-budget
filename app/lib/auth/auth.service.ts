/**
 * Authentication Service
 * Handles user registration, login, and token management
 */

import { PrismaClient } from '@/app/generated/prisma/client';
import { generateTokenPair, generateRefreshToken } from './jwt';
import { hashPassword, verifyPassword, validatePasswordStrength, validateEmail } from './password';
import { AuthTokenResponseDTO, AuthErrorResponseDTO } from '@/app/pages/auth/dtos/auth.dto';

export class AuthService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Register a new user
   * @param email - User email
   * @param password - User password
   * @param name - User name (optional)
   * @returns AuthTokenResponseDTO with tokens and user info
   * @throws Error if registration fails
   */
  async register(email: string, password: string, name?: string): Promise<AuthTokenResponseDTO> {
    // Validate email format
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message || 'Password is not strong enough');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user first to get the real user.id
    const user = await this.prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        isActive: true,
      },
    });

    // Generate tokens using the real user.id
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);

    // Store refresh token on the user record
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return new AuthTokenResponseDTO({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
      },
    });
  }

  /**
   * Login a user
   * @param email - User email
   * @param password - User password
   * @returns AuthTokenResponseDTO with tokens and user info
   * @throws Error if login fails
   */
  async login(email: string, password: string): Promise<AuthTokenResponseDTO> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new Error('User password not set');
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);

    // Update refresh token and last login in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return new AuthTokenResponseDTO({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
      },
    });
  }

  /**
   * Refresh access token using refresh token
   * @param userId - User ID
   * @param refreshToken - The refresh token
   * @returns AuthTokenResponseDTO with new tokens
   * @throws Error if token refresh fails
   */
  async refreshAccessToken(userId: string, refreshToken: string): Promise<AuthTokenResponseDTO> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify refresh token matches stored token
    if (user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user.id, user.email);

    // Update refresh token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    return new AuthTokenResponseDTO({
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
      },
    });
  }

  /**
   * Logout a user by clearing refresh token
   * @param userId - User ID
   * @returns Boolean indicating success
   */
  async logout(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
        },
      });
      return true;
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  /**
   * Get user info by ID
   * @param userId - User ID
   * @returns User object or null if not found
   */
  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
