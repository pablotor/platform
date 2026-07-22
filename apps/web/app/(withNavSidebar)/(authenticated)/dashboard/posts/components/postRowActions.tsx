'use client';

import type { PostResponse } from '@repo/contracts';
import Dropdown from '@repo/ui/dropdown';
import { Edit3, Eye, Info, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import ROUTES from '../../../../../../common/routes';
import DeletePostDialog from '../../../../../../components/dialogs/deletePostDialog';

type PostRowActionsProps = {
  post: PostResponse;
};

const PostRowActions = ({ post }: PostRowActionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Dropdown
        triggerButtonProps={{
          'aria-label': `Actions for ${post.title}`,
          className:
            'flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:focusable-outline',
          children: <MoreHorizontal className="size-4" />,
        }}
        items={[
          {
            asChild: true,
            children: (
              <Link
                href={ROUTES.public.blog.post(post.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="size-4" />
                Preview
              </Link>
            ),
          },
          {
            asChild: true,
            children: (
              <Link href={ROUTES.authenticated.dashboard.posts.info(post.slug)}>
                <Info className="size-4" />
                View details
              </Link>
            ),
          },
          {
            asChild: true,
            children: (
              <Link href={ROUTES.authenticated.dashboard.posts.edit(post.slug)}>
                <Edit3 className="size-4" />
                Edit
              </Link>
            ),
          },
          {
            label: 'Delete',
            icon: <Trash2 className="size-4" />,
            variant: 'destructive',
            separatorBefore: true,
            onSelect: () => setDeleteDialogOpen(true),
          },
        ]}
      />

      <DeletePostDialog
        post={post}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
};

export default PostRowActions;
