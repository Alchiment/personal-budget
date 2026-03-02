import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessTokenEdge } from './app/lib/auth/jwt';

const publicPaths = [
  '/pages/auth/login',
  '/pages/auth/register',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (isPublicPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/pages/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken) {
    try {
      await verifyAccessTokenEdge(accessToken);
      return NextResponse.next();
    } catch {
      // Access token expired, try refresh below
    }
  }

  if (refreshToken) {
    try {
      const refreshResponse = await fetch(new URL('/api/auth/refresh', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const response = NextResponse.next();
        
        response.cookies.set('accessToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 15 * 60,
          sameSite: 'lax',
        });
        
        response.cookies.set('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'lax',
        });
        
        return response;
      }
    } catch {
      // Refresh failed, fall through to login redirect
    }
  }

  const loginUrl = new URL('/pages/auth/login', request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
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
