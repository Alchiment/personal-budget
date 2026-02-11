/**
 * Authentication Module Exports
 * 
 * This module exports all authentication-related utilities, services, and middleware
 * for easy access throughout the application.
 */

// JWT utilities
export {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  extractTokenFromHeader,
  type JWTPayload,
} from './jwt';

// Password utilities
export { hashPassword, verifyPassword, validatePasswordStrength, validateEmail } from './password';

// Authentication service
export { AuthService } from './auth.service';

// Middleware
export { withAuth, withOptionalAuth } from './middleware';
export { type AuthenticatedRequest } from '@/app/pages/auth/dtos/authenticate-request.dto';