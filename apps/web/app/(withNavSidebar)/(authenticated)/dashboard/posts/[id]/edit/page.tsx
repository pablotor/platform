import '@repo/ui/tiptap.css';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { headers } from 'next/headers';

import { postByIdQueryOptions } from '../../../../../../../lib/queryOptions/postsOptions';
import ClientSideEditPost from './clientSideEditPost';

type PageProps = {
  params: Promise<{ id: string }>;
};

const PostEditPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const reqHeaders = await headers();
  const queryClient = new QueryClient();
  const post = await queryClient.query(
    postByIdQueryOptions(id, { headers: reqHeaders }),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 h-full">
      <div className="flex flex-1 h-full gap-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientSideEditPost post={post} />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default PostEditPage;
