import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import ROUTES, {
  DEFAULT_AUTHENTICATED_ROUTE,
  PUBLIC_ROUTES,
} from './common/routes';
import apiClient from './lib/apiClient';

const protectedRoutesProxy = async (request: NextRequest) => {
  const requestHeaders = await headers();
  const hasAuthCookie = requestHeaders
    .get('Cookie')
    ?.includes('better-auth.session_token');
  const isProtectedPath = !PUBLIC_ROUTES.includes(request.nextUrl.pathname);

  if (isProtectedPath && !hasAuthCookie) {
    return NextResponse.redirect(
      new URL(ROUTES.public.auth.signin, request.url),
    );
  }
  if (!isProtectedPath && hasAuthCookie) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url),
    );
  }
  if (!isProtectedPath && !hasAuthCookie) {
    return NextResponse.next();
  }

  const sessionResponse = await apiClient.get<{ session: unknown }>(
    'auth/get-session',
    undefined,
    {
      headers: requestHeaders,
    },
  );

  if (!sessionResponse?.data?.session) {
    return NextResponse.redirect(
      new URL(ROUTES.public.auth.signin, request.url),
    );
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

export default protectedRoutesProxy;
