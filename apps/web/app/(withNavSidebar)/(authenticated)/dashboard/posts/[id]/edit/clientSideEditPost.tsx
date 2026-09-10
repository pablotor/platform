'use client';

import '@repo/ui/tiptap.css';

import {
  PostResponse,
  UpdatePostPayload,
  UpdatePostSchema,
} from '@repo/contracts';
import { useToast } from '@repo/ui/toast/handler';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import ROUTES from '../../../../../../../common/routes';
import PostForm from '../../../../../../../components/forms/postForm';
import useForm from '../../../../../../../hooks/useForm';
import { postUpdateMutationOptions } from '../../../../../../../lib/queryOptions/postsOptions';

type ClientSideEditPostProps = {
  post: PostResponse;
};

const ClientSideEditPost = ({ post }: ClientSideEditPostProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: updatePostAsync } = useMutation(
    postUpdateMutationOptions(post.id, {
      toast,
      onSuccess: (post) => {
        router.push(ROUTES.authenticated.dashboard.posts.info(post.id));
      },
    }),
  );

  const formProps = useForm<UpdatePostPayload>(
    updatePostAsync,
    UpdatePostSchema,
    {
      defaultValues: post,
    },
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 h-full">
      <div className="flex flex-1 h-full gap-8">
        <PostForm
          {...formProps}
          title="Update post"
          submitLabel="Update"
          submitingLabel="Updating"
        />
      </div>
    </div>
  );
};

export default ClientSideEditPost;
