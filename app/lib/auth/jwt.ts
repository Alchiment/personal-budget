/**
 * JWT Token Management Utilities
 * Handles JWT token generation, verification, and payload extraction
 */

import jwt from 'jsonwebtoken';
import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY: string | number = process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY: string | number = process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';

/**
 * Generate a JWT access token
 * @param userId - The user ID
 * @param email - The user email
 * @returns Signed JWT access token
 */
export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
      type: 'access',
    } as JWTPayload,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY } as any
  );
}

/**
 * Generate a JWT refresh token
 * @param userId - The user ID
 * @param email - The user email
 * @returns Signed JWT refresh token
 */
export function generateRefreshToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
      type: 'refresh',
    } as JWTPayload,
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY } as any
  );
}

/**
 * Generate both access and refresh tokens
 * @param userId - The user ID
 * @param email - The user email
 * @returns Object containing both tokens
 */
export function generateTokenPair(userId: string, email: string): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email),
  };
}

/**
 * Verify an access token
 * @param token - The JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify a refresh token
 * @param token - The JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Decode a token without verification (for debugging)
 * @param token - The JWT token to decode
 * @returns Decoded token payload
 */
export function decodeToken(token: string): JWTPayload | null {
  return jwt.decode(token) as JWTPayload | null;
}

/**
 * Extract token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The token or null if not found
 */
export function extractTokenFromHeader(authHeader: string | null | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * Verify an access token using Web Crypto API (Edge Runtime compatible)
 * Use this in middleware instead of verifyAccessToken
 * @param token - The JWT token to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifyAccessTokenEdge(token: string): Promise<JWTPayload> {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as JWTPayload;
  } catch {
    throw new Error('Invalid or expired access token');
  }
}
