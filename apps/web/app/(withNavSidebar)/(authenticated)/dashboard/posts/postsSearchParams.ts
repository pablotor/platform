import {
  createLoader,
  createSearchParamsCache,
  parseAsStringEnum,
} from 'nuqs/server';

// Shared between the server-side cache (page.tsx) and client components
// (ViewSwitcher, OrderControl) — see nuqs's server-side docs on reusing a
// parser declaration across both.
export const postsSearchParamsParsers = {
  order: parseAsStringEnum(['asc', 'desc'] as const).withDefault('desc'),
  view: parseAsStringEnum(['list', 'compact', 'grid'] as const).withDefault(
    'list',
  ),
};

export const postsSearchParamsCache = createSearchParamsCache(
  postsSearchParamsParsers,
);

export const loadPostsSearchParams = createLoader(postsSearchParamsParsers);
