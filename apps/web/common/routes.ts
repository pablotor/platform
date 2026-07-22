type RouteLeaf = string | ((...args: string[]) => string);
type RouteTree = { readonly [key: string]: RouteLeaf | RouteTree };

const ROUTES = {
  public: {
    root: '/',
    auth: {
      signin: '/signin',
      signup: '/signup',
    },
    blog: {
      root: '/blog',
      post: (slug: string) => `/blog/${slug}`,
    },
    docs: {
      root: '/docs',
      quickstart: '/docs/quickstart',
      philosophy: '/docs/philosophy',
      architecture: '/docs/architecture',
      cheatsheet: '/docs/cheatsheet',
      design: {
        fundamentals: '/docs/design/fundamentals',
        typography: '/docs/design/typography',
        colors: '/docs/design/colors',
        composition: '/docs/design/composition',
      },
    },
  },
  authenticated: {
    dashboard: {
      root: '/dashboard',
      posts: {
        root: '/dashboard/posts',
        new: '/dashboard/posts/new',
        info: (slug: string) => `/dashboard/posts/${slug}`,
        edit: (slug: string) => `/dashboard/posts/${slug}/edit`,
      },
    },
  },
} as const satisfies RouteTree;

export const DEFAULT_PUBLIC_ROUTE = ROUTES.public.root;
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.authenticated.dashboard.root;

// Only signin/signup should bounce an already-authenticated user away
export const GUEST_ONLY_ROUTES: readonly string[] = [
  ROUTES.public.auth.signin,
  ROUTES.public.auth.signup,
];

export const PROTECTED_PATH_PREFIXES: readonly string[] = [
  ROUTES.authenticated.dashboard.root,
];

export default ROUTES;
