import { PostPublicResponse } from '@repo/contracts';
import { notFound } from 'next/navigation';

import PostLayout from '../../../components/post/postLayout';
import apiClient, { FetchError } from '../../../lib/apiClient';

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  // Why this doesn't use tanstack/query?
  // Because we don't really care about state management here.
  const post = await apiClient
    .get<PostPublicResponse>(`public/posts/${slug}`)
    .then(({ data }) => data)
    .catch((error) => {
      if (error instanceof FetchError && error.responseStatus === 404) {
        notFound();
      }
      throw error;
    });

  return (
    <main>
      <PostLayout {...post} />
    </main>
  );
};

export default PostPage;
