'use client';

import { CreatePost, CreatePostSchema } from '@repo/contracts';
import Button from '@repo/ui/button';
import Input from '@repo/ui/input';
import { useRouter } from 'next/navigation';

import ROUTES from '../../../../../../../common/routes';
import useForm from '../../../../../../../hooks/useForm';
import apiClient from '../../../../../../../lib/apiClient';
import ContentFormWrapper from './contentFormWrapper';

const CreatePostForm = () => {
  const router = useRouter();
  const { action, register } = useForm<CreatePost>(async (payload) => {
    await apiClient.post('/posts', payload, {
      onSuccess: () => {
        router.push(ROUTES.authenticated.dashboard.posts.root);
      },
    });
  }, CreatePostSchema);
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
