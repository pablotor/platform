'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';

import { postsQueryOptions } from '../../../../../../lib/queryOptions/postsOptions';
import { postsSearchParams } from '../postsSearchParams';
import EmptyState from './emptyState';
import PostList from './postList';
import PostsToolbar from './postsToolbar';

const PostListPanel = () => {
  const [{ order, view }] = useQueryStates(postsSearchParams);
  const {
    data: posts,
    // isLoading,
    isSuccess,
  } = useQuery({ ...postsQueryOptions({ order }) });

  return (
    <>
      <PostsToolbar />
      {/* {isLoading && <LoadingAnimation />} */}
      {isSuccess &&
        posts &&
        (posts.length === 0 ? (
          <EmptyState />
        ) : (
          <PostList posts={posts} view={view} />
        ))}
    </>
  );
};

export default PostListPanel;
