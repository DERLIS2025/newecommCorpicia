import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Middleware] Missing Supabase environment variables');
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            supabaseResponse.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            supabaseResponse.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/');
    const isAdminCallback = pathname.startsWith('/admin/auth');
    const isPublicAdminRoute = isAdminLogin || isAdminCallback;

    if (isPublicAdminRoute) {
      // Allow public access to auth-related admin routes without redirect loops
      return supabaseResponse;
    }

    const isAdminRoute = pathname.startsWith('/admin');

    // If user is NOT logged in and trying to access a protected admin route, redirect to login
    if (!user && isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Verify admin_profiles for protected admin routes
    if (user && isAdminRoute) {
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .single();

      if (!profile || !profile.is_active) {
        // If no valid profile or inactive, deny access by signing out and redirecting
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error('[Middleware] Unexpected error:', error);
    return NextResponse.next();
  }
}
