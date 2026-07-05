type RouteLeaf = string | ((...args: string[]) => string);
type RouteTree = { readonly [key: string]: RouteLeaf | RouteTree };

const staticValuesDeep = (tree: RouteTree): string[] =>
  Object.values(tree).flatMap((v) =>
    typeof v === 'string'
      ? [v]
      : typeof v === 'function'
        ? []
        : staticValuesDeep(v as RouteTree),
  );

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
    design: {
      base: '/design',
      get fundamentals() {
        return `${this.base}/fundamentals`;
      },
      get typography() {
        return `${this.base}/typography`;
      },
      get colors() {
        return `${this.base}/colors`;
      },
      get composition() {
        return `${this.base}/composition`;
      },
    },
  },
} as const;

export const PUBLIC_ROUTES = staticValuesDeep(ROUTES.public);
export const DEFAULT_PUBLIC_ROUTE = ROUTES.public.root;
export const AUTHENTICATED_ROUTES = staticValuesDeep(ROUTES.authenticated);
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.authenticated.dashboard;

export default ROUTES;
