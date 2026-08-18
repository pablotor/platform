import Button from '@repo/ui/button';
import Link from 'next/link';

import ROUTES from '../../../../../../common/routes';

const EmptyState = () => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-16 text-center">
    <h2 className="text-subtitle">No posts yet</h2>
    <p className="max-w-sm text-body-sm text-muted-foreground">
      Write your first post and it&apos;ll show up here.
    </p>
    <Button
      variant="default"
      as={Link}
      href={ROUTES.authenticated.dashboard.posts.create}
    >
      New post
    </Button>
  </div>
);

export default EmptyState;
