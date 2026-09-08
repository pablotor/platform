'use client';

import Button from '@repo/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ROUTES from '../../../../../../../common/routes';
import ArchiveDialog from '../../../../../../../components/dialogs/archivePostDialog';
import DeletePostDialog from '../../../../../../../components/dialogs/deletePostDialog';
import {
  postByIdQueryOptions,
  postUpdatePublicationStatusMutationOptions,
} from '../../../../../../../lib/queryOptions/postsOptions';
import PublishSwitch from './publishSwitch';

type PostControlsProps = {
  postId: string;
};

const PostControls = ({ postId }: PostControlsProps) => {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: post } = useQuery(postByIdQueryOptions(postId));
  const { mutate: changePublicationStatus } = useMutation(
    postUpdatePublicationStatusMutationOptions(postId),
  );
  const router = useRouter();

  const isPublished = post?.status === 'PUBLISHED';
  const isArchived = post?.status === 'ARCHIVED';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
      {post?.status === 'ARCHIVED' ? (
        <span className="text-ui text-foreground">Archived</span>
      ) : (
        <label className="flex items-center gap-3">
          <PublishSwitch
            checked={isPublished}
            disabled={isArchived}
            onCheckedChange={() =>
              changePublicationStatus(isPublished ? 'UNPUBLISHED' : 'PUBLISHED')
            }
          />
          <span className="text-ui text-foreground">
            {isPublished ? 'Published' : 'Unpublished'}
          </span>
        </label>
      )}

      <div className="flex items-center gap-2">
        {post?.status !== 'ARCHIVED' && (
          <>
            <Button
              variant="outline"
              size="sm"
              as={Link}
              href={ROUTES.authenticated.dashboard.posts.edit(postId)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!post}
              onClick={() => setArchiveDialogOpen(true)}
            >
              Archive
            </Button>
          </>
        )}
        <Button
          variant="destructive"
          size="sm"
          disabled={!post}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>

      {post && (
        <>
          <ArchiveDialog
            post={post}
            open={archiveDialogOpen}
            onOpenChange={setArchiveDialogOpen}
          />
          <DeletePostDialog
            post={post}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={() =>
              router.push(ROUTES.authenticated.dashboard.posts.root)
            }
          />
        </>
      )}
    </div>
  );
};

export default PostControls;
