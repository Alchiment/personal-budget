/**
 * Password Hashing Utilities
 * Handles password hashing and verification using bcryptjs
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcryptjs
 * @param password - The plain text password to hash
 * @returns Promise containing the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against a hash
 * @param password - The plain text password
 * @param hash - The hashed password to compare against
 * @returns Promise containing boolean indicating if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Failed to verify password');
  }
}

/**
 * Validate password requirements
 * Requires: minimum 8 characters, at least one uppercase, one lowercase, one number
 * @param password - The password to validate
 * @returns Object containing validation result and error message
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true };
}

/**
 * Validate email format
 * @param email - The email to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
