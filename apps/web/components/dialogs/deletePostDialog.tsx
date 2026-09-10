'use client';

import type { PostQueryResponse } from '@repo/contracts';
import Button from '@repo/ui/button';
import Dialog from '@repo/ui/dialog';
import { useToast } from '@repo/ui/toast/handler';
import { useMutation } from '@tanstack/react-query';

import { postDeleteMutationOptions } from '../../lib/queryOptions/postsOptions';

type DeletePostDialogProps = {
  post: PostQueryResponse[number];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const DeletePostDialog = ({
  post,
  open,
  onOpenChange,
  onSuccess,
}: DeletePostDialogProps) => {
  const { toast } = useToast();
  const { mutate: handleDelete, isPending: isDeleting } = useMutation(
    postDeleteMutationOptions(post.id, {
      toast,
      onSuccess,
      onSettled: () => onOpenChange(false),
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete "${post.title}"?`}
      description="This can't be undone. The post will be permanently removed."
      actions={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete post'}
          </Button>
        </>
      }
    />
  );
};

export default DeletePostDialog;
