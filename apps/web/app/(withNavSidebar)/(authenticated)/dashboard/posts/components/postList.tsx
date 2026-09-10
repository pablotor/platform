import type { PostQueryResponse } from '@repo/contracts';

import PostListItem from './postListItem';

type PostListProps = {
  posts: PostQueryResponse;
  view: 'list' | 'compact' | 'grid';
};

const PostList = ({ posts, view }: PostListProps) => {
  if (view !== 'list') {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-body-sm text-muted-foreground">
          This view isn&apos;t built yet — switch back to List.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
