'use client';

import Button from '@repo/ui/button';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useQueryStates } from 'nuqs';

import ROUTES from '../../../../../../common/routes';
import postsQueryOptions from '../../../../../../lib/queryOptions/postsQueryOptions';
import { postsSearchParams } from '../postsSearchParams';

type postListHeaderProps = {
  authorId: string;
};

const PostListHeader = ({ authorId }: postListHeaderProps) => {
  const [{ order }] = useQueryStates(postsSearchParams);
  const { data: posts } = useQuery({
    ...postsQueryOptions({ authorId, order }),
  });

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-title">Your posts</h1>
        <p className="text-body-sm text-muted-foreground">
          {posts?.length} {posts?.length === 1 ? 'post' : 'posts'}
        </p>
      </div>
      <div className={clsx('mt-auto', posts?.length === 0 && 'hidden')}>
        <Button
          variant="default"
          as={Link}
          size="sm"
          href={ROUTES.authenticated.dashboard.posts.create}
        >
          <Plus strokeWidth={2.5} />
          New post
        </Button>
      </div>
    </div>
  );
};

export default PostListHeader;
