'use client';

import type { PostResponse } from '@repo/contracts';
import Button from '@repo/ui/button';
import Dialog from '@repo/ui/dialog';
import { useToast } from '@repo/ui/toast/handler';
import { useMutation } from '@tanstack/react-query';

import { postUpdatePublicationStatusMutationOptions } from '../../lib/queryOptions/postsOptions';

type ArchiveDialogProps = {
  post: PostResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const ArchiveDialog = ({ post, open, onOpenChange }: ArchiveDialogProps) => {
  const { toast } = useToast();
  const { mutate: handleUpdateStatus, isPending: isArchiving } = useMutation(
    postUpdatePublicationStatusMutationOptions(post.id, {
      toast,
      onSettled: () => onOpenChange(false),
    }),
  );
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Archive "${post.title}"?`}
      description="Archived posts are hidden from the public blog and cannot be restored nor updated."
      actions={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleUpdateStatus('ARCHIVED')}
            disabled={isArchiving}
          >
            {isArchiving ? 'Archiving…' : 'Archive post'}
          </Button>
        </>
      }
    />
  );
};

export default ArchiveDialog;
