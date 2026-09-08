'use client';

import '@repo/ui/tiptap.css';

import { CreatePost, CreatePostSchema } from '@repo/contracts';
import { useToast } from '@repo/ui/toast/handler';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import ROUTES from '../../../../../../common/routes';
import PostForm from '../../../../../../components/forms/postForm';
import useForm from '../../../../../../hooks/useForm';
import { postCreateMutationOptions } from '../../../../../../lib/queryOptions/postsOptions';

const CreatePostsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createPostAsync } = useMutation(
    postCreateMutationOptions({
      toast,
      onSuccess: (post) => {
        router.push(ROUTES.authenticated.dashboard.posts.info(post.id));
      },
    }),
  );

  const formProps = useForm<CreatePost>(createPostAsync, CreatePostSchema);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 h-full">
      <div className="flex flex-1 h-full gap-8">
        <PostForm
          {...formProps}
          title="Create post"
          submitLabel="Create"
          submitingLabel="Creating"
        />
      </div>
    </div>
  );
};

export default CreatePostsPage;
