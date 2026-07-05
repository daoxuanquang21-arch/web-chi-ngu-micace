import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect /admin routes (except login)
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  // Protect mutating /api/posts routes
  const isApiRoute = 
    (pathname.startsWith('/api/posts') && request.method !== 'GET') || 
    (pathname.startsWith('/api/categories') && request.method !== 'GET') || 
    pathname.startsWith('/api/users');

  if (isAdminRoute || isApiRoute) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Enforce ADMIN role for user management and category management
      if ((pathname.startsWith('/admin/users') || pathname.startsWith('/admin/categories')) && payload.role !== 'ADMIN' && payload.role !== 'EDITOR') {
         // Wait, EDITOR can manage categories. Let's restrict users to ADMIN only.
         if (pathname.startsWith('/admin/users') && payload.role !== 'ADMIN') {
           return NextResponse.redirect(new URL('/admin/dashboard', request.url));
         }
         // Categories can be managed by ADMIN or EDITOR
         if (pathname.startsWith('/admin/categories') && payload.role !== 'ADMIN' && payload.role !== 'EDITOR') {
           return NextResponse.redirect(new URL('/admin/dashboard', request.url));
         }
      }
      
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.id);
      response.headers.set('x-user-role', payload.role);
      return response;
    } catch (error) {
      if (isApiRoute) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/categories/:path*', '/api/users/:path*'],
};
