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

  // Check if user has admin or editor role for admin pages
  if (isAdminPage && userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    return Response.redirect(new URL('/', nextUrl));
  }

  // Restrict certain admin pages to ADMIN only
  const adminOnlyPages = ['/admin/users', '/admin/settings', '/admin/social-links'];
  const isAdminOnlyPage = adminOnlyPages.some(page => nextUrl.pathname.startsWith(page));
  
  if (isAdminOnlyPage && userRole !== 'ADMIN') {
    return Response.redirect(new URL('/admin', nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};
