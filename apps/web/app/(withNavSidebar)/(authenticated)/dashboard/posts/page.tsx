import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import postsOptions from '../../../../../lib/queryOptions/postsQueryOptions';
import { getUser } from '../../../../../lib/userContext';
import PostListHeader from './components/postListHeader';
import PostListPanel from './components/postListPanel';
import { loadPostsSearchParams } from './postsSearchParams';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const DashboardPostsPage = async ({ searchParams }: PageProps) => {
  const { order } = await loadPostsSearchParams(searchParams);
  const user = await getUser();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(postsOptions({ authorId: user?.id, order }));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostListHeader authorId={user!.id} />
        <PostListPanel authorId={user!.id} />
      </HydrationBoundary>
    </div>
  );
};

export default DashboardPostsPage;
