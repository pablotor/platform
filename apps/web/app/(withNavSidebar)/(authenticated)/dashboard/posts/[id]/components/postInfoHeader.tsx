import type { PostResponse } from '@repo/contracts';

import ROUTES from '../../../../../../../common/routes';
import BackTo from '../../../../../../../components/backTo';

type PostInfoHeaderProps = {
  post: PostResponse;
};

const PostInfoHeader = ({ post }: PostInfoHeaderProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex w-full justify-end">
      <BackTo
        href={ROUTES.authenticated.dashboard.posts.root}
        label="listing"
      />
    </div>
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
