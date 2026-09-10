import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import ROUTES, {
  DEFAULT_AUTHENTICATED_ROUTE,
  GUEST_ONLY_ROUTES,
  PROTECTED_PATH_PREFIXES,
} from './common/routes';
import apiClient from './lib/apiClient';
import authClient from './lib/authClient';
import { setUserHeaders } from './lib/userContext';

/**
 * The protectedRoutesProxy checks the four typical combinations of
 * isAuthenticated and isProtectedPath. In case both are true, it decorates
 * the request with the user headers
 */
const protectedRoutesProxy = async (request: NextRequest) => {
  const requestHeaders = await headers();
  const isAuthenticated = requestHeaders
    .get('Cookie')
    ?.includes('better-auth.session_token');
  const isProtectedPath = PROTECTED_PATH_PREFIXES.some((protectedPathPrefix) =>
    request.nextUrl.pathname.startsWith(protectedPathPrefix),
  );
  const isGuestOnlyPath = GUEST_ONLY_ROUTES.some(
    (guestOnlyPaths) => request.nextUrl.pathname === guestOnlyPaths,
  );

  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(ROUTES.public.auth.signin, request.url),
    );
  }
  if (isGuestOnlyPath && isAuthenticated) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url),
    );
  }
  if (!isProtectedPath && !isAuthenticated) {
    return NextResponse.next();
  }

  // isPotectedPath && isAuthenticated
  // I'd prefer to use auth.api here, but it's not working on server components
  // when using an external api
  const { data: session } = await apiClient.get<
    typeof authClient.$Infer.Session
  >('auth/get-session', undefined, {
    headers: requestHeaders,
  });

  if (!session) {
    const cookieStore = await cookies();
    cookieStore.delete('better-auth.session_token');
    return NextResponse.redirect(
      new URL(ROUTES.public.auth.signin, request.url),
    );
  }

  const forwardedHeaders = new Headers(requestHeaders);
  setUserHeaders(forwardedHeaders, session.user);

  return NextResponse.next({
    request: {
      headers: forwardedHeaders,
    },
  });
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

export default protectedRoutesProxy;
