import { PostQuery, PostResponse } from '@repo/contracts';
import { Toast } from '@repo/ui/toast/handler';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

import apiClient from '../apiClient';
import getQueryClient from '../queryClient';

// key definition avoids typo issues
const postsKey = 'posts';

export const postsQueryOptions = (filters: Partial<PostQuery> = {}) => {
  const fetchPosts = ({ authorId, order }: Partial<PostQuery>) =>
    apiClient
      .get<PostResponse[], Partial<PostQuery>>(postsKey, {
        authorId,
        order,
      })
      .then(({ data }) => data);

  return queryOptions<PostResponse[]>({
    queryKey: [postsKey, filters.authorId, filters.order],
    queryFn: () => fetchPosts(filters),
  });
};

export const postDeleteMutationOptions = (
  slug: string,
  options: { toast?: Toast; onSettled?: () => void } = {},
) => {
  const deletePost = (slug: string) => apiClient.delete(`posts/${slug}`);
  const queryClient = getQueryClient();
  const toastKey = `${slug}-delete`;

  return mutationOptions({
    mutationFn: () => deletePost(slug),
    onMutate: () => options.toast?.({ toastKey, mode: 'loading' }),
    onError: (e) =>
      options.toast?.({
        toastKey,
        mode: 'error',
        content: `Operation failed: ${e.message}`,
      }),
    onSuccess: () => {
      options.toast?.({ toastKey, mode: 'success', content: 'Post deleted' });
      queryClient.setQueriesData<PostResponse[]>(
        { queryKey: [postsKey] },
        (prev) => prev?.filter((post) => post.slug !== slug),
      );
      // reconcile with server in background
      queryClient.invalidateQueries({ queryKey: [postsKey] });
    },
    onSettled: options.onSettled,
  });
};
