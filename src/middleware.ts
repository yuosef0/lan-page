import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Middleware - Path:', req.nextUrl.pathname);
  console.log('Middleware - Session:', session ? 'exists' : 'none');
  console.log('Middleware - Cookies:', req.cookies.getAll().map(c => c.name));

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!session) {
      console.log('Middleware - Redirecting to login (no session)');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Redirect to dashboard if already logged in
  if (req.nextUrl.pathname === '/admin/login' && session) {
    console.log('Middleware - Redirecting to dashboard (has session)');
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
