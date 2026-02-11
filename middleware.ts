
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './app/lib/auth/jwt';

// Define paths that do not require authentication
const publicPaths = [
  '/pages/auth/login',
  '/pages/auth/register',
  // Add other public routes here
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is public
  // We check if the pathname starts with any of the public paths to handle sub-routes if necessary
  // or exact match depending on requirement. Exact match is safer for specific pages.
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for presence of the token
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    // specific to login if not authenticated
    // Use request.url to construct absolute URL which implies the same host
    const loginUrl = new URL('/pages/auth/login', request.url);
    // Optional: Add ?from=pathname to redirect back after login
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token
    verifyAccessToken(token);
    return NextResponse.next();
  } catch (error) {
    // Token invalid or expired
    const loginUrl = new URL('/pages/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // Match all request paths except for:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder files (if any specifically needed, though typically served by next)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
