import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // TODO: Verify real session token when Supabase Auth is integrated.
    // Currently Supabase Auth is NOT implemented. 
    // This is a secure structure ready for the future.
    // We do NOT use fake cookies, local storage, or mock sessions.
    
    // For Sprint 0, we allow access to the admin structure to see the "Under Construction" screens,
    // but in Sprint 1 this will redirect to /admin/login if unauthenticated.
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
