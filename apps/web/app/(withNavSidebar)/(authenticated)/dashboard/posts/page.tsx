import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';
import type { SearchParams } from 'nuqs/server';

import { postsQueryOptions } from '../../../../../lib/queryOptions/postsOptions';
import PostListHeader from './components/postListHeader';
import PostListPanel from './components/postListPanel';
import { loadPostsSearchParams } from './postsSearchParams';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const DashboardPostsPage = async ({ searchParams }: PageProps) => {
  const { order } = await loadPostsSearchParams(searchParams);
  const reqHeaders = await headers();
  const queryClient = new QueryClient();
  await queryClient.query(
    postsQueryOptions({ order }, { headers: reqHeaders }),
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostListHeader />
        <PostListPanel />
      </HydrationBoundary>
    </div>
  );
};

export default DashboardPostsPage;
