type RouteObject = string | { [key: string]: RouteObject };

const objectValuesDeep = (route: RouteObject): string[] =>
  typeof route === 'string'
    ? [route]
    : Object.values(route).flatMap(objectValuesDeep);

const ROUTES = {
  public: {
    root: '/',
    auth: {
      signin: '/signin',
      signup: '/signup',
    },
  },
  authenticated: {
    dashboard: '/dashboard',
  },
};

export const PUBLIC_ROUTES = objectValuesDeep(ROUTES.public);
export const AUTHENTICATED_ROUTES = objectValuesDeep(ROUTES.authenticated);
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.authenticated.dashboard;

export default ROUTES;
