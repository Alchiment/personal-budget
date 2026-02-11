/**
 * Authentication Data Transfer Objects (DTOs)
 * Defines request and response structures for auth operations
 */

export interface LoginRequestDTOInterface {
  email: string;
  password: string;
}

export class LoginRequestDTO implements LoginRequestDTOInterface {
  email: string;
  password: string;

  constructor(data: LoginRequestDTOInterface) {
    this.email = data.email;
    this.password = data.password;
  }
}

export interface RegisterRequestDTOInterface {
  email: string;
  password: string;
  name?: string;
}

export class RegisterRequestDTO implements RegisterRequestDTOInterface {
  email: string;
  password: string;
  name?: string;

  constructor(data: RegisterRequestDTOInterface) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
  }
}

export interface AuthTokenResponseDTOInterface {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export class AuthTokenResponseDTO implements AuthTokenResponseDTOInterface {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };

  constructor(data: AuthTokenResponseDTOInterface) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.user = data.user;
  }
}

export interface RefreshTokenRequestDTOInterface {
  refreshToken: string;
}

export class RefreshTokenRequestDTO implements RefreshTokenRequestDTOInterface {
  refreshToken: string;

  constructor(data: RefreshTokenRequestDTOInterface) {
    this.refreshToken = data.refreshToken;
  }
}

export interface AuthErrorResponseDTOInterface {
  error: string;
  message: string;
}

export class AuthErrorResponseDTO implements AuthErrorResponseDTOInterface {
  error: string;
  message: string;

  constructor(error: string, message: string) {
    this.error = error;
    this.message = message;
  }
}
