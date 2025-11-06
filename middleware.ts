import { auth } from '@/lib/auth-server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthPage = nextUrl.pathname.startsWith('/login') || 
                     nextUrl.pathname.startsWith('/register');
  const isAdminPage = nextUrl.pathname.startsWith('/admin');

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL('/admin', nextUrl));
  }

  // Redirect unauthenticated users to login
  if (isAdminPage && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Check if user has admin role for admin pages
  if (isAdminPage && userRole !== 'ADMIN') {
    return Response.redirect(new URL('/', nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};
