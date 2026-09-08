import type { PostResponse } from '@repo/contracts';

type PostInfoHeaderProps = {
  post: PostResponse;
};

const PostInfoHeader = ({ post }: PostInfoHeaderProps) => (
  <div className="flex flex-col gap-2">
    {post.kicker && (
      <span className="text-label text-brand-primary-accent">
        {post.kicker}
      </span>
    )}
    <h1 className="text-title">{post.title}</h1>
    <span className="text-body-sm text-muted-foreground">/{post.slug}</span>
  </div>
);

export default PostInfoHeader;
