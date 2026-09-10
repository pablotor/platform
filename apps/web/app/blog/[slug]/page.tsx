import { PostPublicResponse } from '@repo/contracts';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import PostLayout from '../../../components/post/postLayout';
import apiClient, { FetchError } from '../../../lib/apiClient';

const getPost = cache((slug: string) =>
  apiClient
    .get<PostPublicResponse>(`public/posts/${slug}`)
    .then(({ data }) => data)
    .catch((error) => {
      if (error instanceof FetchError && error.responseStatus === 404) {
        notFound();
      }
      throw error;
    }),
);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
};

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <main>
      <PostLayout {...post} />
    </main>
  );
};

export default PostPage;
