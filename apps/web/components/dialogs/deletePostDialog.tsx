'use client';

import type { PostResponse } from '@repo/contracts';
import Button from '@repo/ui/button';
import Dialog from '@repo/ui/dialog';
import { useState } from 'react';

type DeletePostDialogProps = {
  post: PostResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DeletePostDialog = ({
  post,
  open,
  onOpenChange,
}: DeletePostDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // TODO: call DELETE /posts/:slug via apiClient, then close the dialog
    // and refresh the list (router.refresh() or equivalent revalidation).
    // Not implemented yet — this is the confirm-dialog shell only.
    setIsDeleting(false);
    onOpenChange(false);
  };

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
            onClick={handleDelete}
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
