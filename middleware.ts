import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/middleware';

const protectedRoutes = {
  student: ['/dashboard', '/nutrition', '/fitness', '/measurements', '/forum', '/settings'],
  coach: ['/coach/dashboard', '/coach/students', '/coach/nutrition-plans', '/coach/fitness-programs'],
};

const authRoutes = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { supabase, user, response } = await createClient(request);
  
  const { pathname } = request.nextUrl;
  
  // Check if route requires authentication
  const isProtectedRoute = [...protectedRoutes.student, ...protectedRoutes.coach].some(route =>
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If accessing auth routes while logged in, redirect to dashboard
  if (isAuthRoute && user) {
    const redirectUrl = user.user_metadata?.role === 'coach' ? '/coach/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  // If accessing protected route without authentication
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based access control
  if (user && isProtectedRoute) {
    const userRole = user.user_metadata?.role;
    
    // Coach trying to access student routes
    if (userRole === 'coach' && protectedRoutes.student.some(route => pathname.startsWith(route) && !pathname.startsWith('/coach'))) {
      return NextResponse.redirect(new URL('/coach/dashboard', request.url));
    }
    
    // Student trying to access coach routes
    if (userRole === 'student' && protectedRoutes.coach.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-*.js).*)',
  ],
};