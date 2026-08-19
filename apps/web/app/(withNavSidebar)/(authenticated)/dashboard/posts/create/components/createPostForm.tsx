'use client';

import { CreatePost, CreatePostSchema } from '@repo/contracts';
import Button from '@repo/ui/button';
import Input from '@repo/ui/input';
import { useToast } from '@repo/ui/toast/handler';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import ROUTES from '../../../../../../../common/routes';
import useForm from '../../../../../../../hooks/useForm';
import { postCreateMutationOptions } from '../../../../../../../lib/queryOptions/postsOptions';
import ContentFormWrapper from './contentFormWrapper';

const CreatePostForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createPostAsync } = useMutation(
    postCreateMutationOptions({
      toast,
      onSuccess: () => {
        router.push(ROUTES.authenticated.dashboard.posts.root);
      },
    }),
  );
  const { action, register } = useForm<CreatePost>(
    createPostAsync,
    CreatePostSchema,
  );
  return (
    <form action={action} className="flex flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-title">Create post</h1>
        <div className="mt-auto">
          <Button variant="default" type="submit" size="sm">
            Publish
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-full gap-4 pt-8">
        <Input label="Title" {...register('title')} />
        <ContentFormWrapper label="Content" {...register('content')} />
      </div>
    </form>
  );
};

export default CreatePostForm;
