import { QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

import ROUTES from '../../../../../../../common/routes';
import PostLayout from '../../../../../../../components/post/postLayout';
import { postByIdQueryOptions } from '../../../../../../../lib/queryOptions/postsOptions';
import { getUser } from '../../../../../../../lib/userContext';

const PostPreviewPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = (await getUser()) || undefined;
  const reqHeaders = await headers();
  const queryClient = new QueryClient();
  const post = await queryClient.query(
    postByIdQueryOptions(id, { headers: reqHeaders }),
  );

  return (
    <main>
      <PostLayout
        post={{ ...post, author: user }}
        backTo={{
          href: ROUTES.authenticated.dashboard.posts.info(id),
          label: 'post info',
        }}
      />
    </main>
  );
};

export default PostPreviewPage;
