import type { PostQuery, PostResponse } from '@repo/contracts';
import Button from '@repo/ui/button';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { SearchParams } from 'nuqs/server';

import ROUTES from '../../../../../common/routes';
import apiClient from '../../../../../lib/apiClient';
import { getUser } from '../../../../../lib/userContext';
import EmptyState from './components/emptyState';
import PostList from './components/postList';
import PostsToolbar from './components/postsToolbar';
import { loadPostsSearchParams } from './postsSearchParams';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const DashboardPostsPage = async ({ searchParams }: PageProps) => {
  const { order, view } = await loadPostsSearchParams(searchParams);
  const user = await getUser();

  const { data: posts } = await apiClient.get<
    PostResponse[],
    Partial<PostQuery>
  >('posts', {
    authorId: user!.id,
    order,
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-title">Your posts</h1>
          <p className="text-body-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <div className={clsx('mt-auto', posts.length === 0 && 'hidden')}>
          <Button
            variant="default"
            as={Link}
            size="sm"
            href={ROUTES.authenticated.dashboard.posts.new}
          >
            <Plus strokeWidth={2.5} />
            New post
          </Button>
        </div>
      </div>

      <PostsToolbar />

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <PostList posts={posts} view={view} />
      )}
    </div>
  );
};

export default DashboardPostsPage;
