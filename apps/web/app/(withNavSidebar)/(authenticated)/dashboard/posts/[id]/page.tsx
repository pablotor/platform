import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';

import { postByIdQueryOptions } from '../../../../../../lib/queryOptions/postsOptions';
import MetricsPlaceholder from './components/metricsPlaceholder';
import PostControls from './components/postControls';
import PostInfoHeader from './components/postInfoHeader';

type PageProps = {
  params: Promise<{ id: string }>;
};

const PostInfoPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const reqHeaders = await headers();
  const queryClient = new QueryClient();
  const post = await queryClient.query(
    postByIdQueryOptions(id, { headers: reqHeaders }),
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <PostInfoHeader post={post} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostControls postId={id} />
      </HydrationBoundary>
      <MetricsPlaceholder />
    </div>
  );
};

export default PostInfoPage;
