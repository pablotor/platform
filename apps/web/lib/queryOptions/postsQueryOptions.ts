import { PostQuery, PostResponse } from '@repo/contracts';
import { queryOptions } from '@tanstack/react-query';

import apiClient from '../apiClient';

const postsQueryOptions = (filters: Partial<PostQuery> = {}) => {
  const fetchPosts = ({ authorId, order }: Partial<PostQuery>) =>
    apiClient
      .get<PostResponse[], Partial<PostQuery>>('posts', {
        authorId,
        order,
      })
      .then(({ data }) => data);

  return queryOptions<PostResponse[]>({
    queryKey: ['posts', filters.authorId, filters.order],
    queryFn: () => fetchPosts(filters),
  });
};

export default postsQueryOptions;
