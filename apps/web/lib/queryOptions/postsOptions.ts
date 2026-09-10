import {
  CreatePostPayload,
  PostQueryPayload,
  PostQueryResponse,
  PostResponse,
  PostStatus,
  UpdatePostPayload,
} from '@repo/contracts';
import { Toast } from '@repo/ui/toast/handler';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

import apiClient from '../apiClient';
import getQueryClient from '../queryClient';

// key definition avoids typo issues
const postsKey = 'posts';

export const postByIdQueryOptions = (
  id: string,
  options: { headers?: HeadersInit } = {},
) => {
  const fetchPostById = () =>
    apiClient
      .get<PostResponse>(`posts/${id}`, undefined, { headers: options.headers })
      .then(({ data }) => data);

  return queryOptions<PostResponse>({
    queryKey: [postsKey, { id }],
    queryFn: () => fetchPostById(),
  });
};

export const postsQueryOptions = (
  query: PostQueryPayload = {},
  options: { headers?: HeadersInit } = {},
) => {
  const fetchPosts = (query: PostQueryPayload) =>
    apiClient
      .get<
        PostQueryResponse,
        PostQueryPayload
      >('posts', query, { headers: options.headers })
      .then(({ data }) => data);

  return queryOptions<PostQueryResponse>({
    queryKey: [postsKey, query.order, query],
    queryFn: () => fetchPosts(query),
  });
};

export const postDeleteMutationOptions = (
  id: string,
  options: {
    toast?: Toast;
    onSuccess?: () => void;
    onSettled?: () => void;
  } = {},
) => {
  const deletePost = (id: string) => apiClient.delete(`posts/${id}`);
  const queryClient = getQueryClient();
  const toastKey = `post-${id}-delete`;

  return mutationOptions({
    mutationFn: () => deletePost(id),
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
        (prev) =>
          Array.isArray(prev)
            ? prev.filter((post) => post.id !== id)
            : undefined,
      );
      // reconcile with server in background
      queryClient.invalidateQueries({ queryKey: [postsKey] });
      options.onSuccess?.();
    },
    onSettled: options.onSettled,
  });
};

export const postCreateMutationOptions = (
  options: { toast?: Toast; onSuccess?: (post: PostResponse) => void } = {},
) => {
  const createPost = (payload: CreatePostPayload) =>
    apiClient.post<PostResponse, CreatePostPayload>('/posts', payload);
  const queryClient = getQueryClient();
  const toastKey = 'post-create';

  return mutationOptions({
    mutationFn: (payload: CreatePostPayload) =>
      createPost(payload).then(({ data }) => data),
    onMutate: () => options.toast?.({ toastKey, mode: 'loading' }),
    onError: (e) =>
      options.toast?.({
        toastKey,
        mode: 'error',
        content: `Operation failed: ${e.message}`,
      }),
    onSuccess: (post) => {
      options.toast?.({ toastKey, mode: 'success', content: 'Post created' });
      queryClient.setQueryData([postsKey, { id: post.id }], post);
      queryClient.invalidateQueries({ queryKey: [postsKey] });
      options.onSuccess?.(post);
    },
  });
};

export const postUpdateMutationOptions = (
  id: string,
  options: { toast?: Toast; onSuccess?: (post: PostResponse) => void } = {},
) => {
  const updatePost = (payload: UpdatePostPayload) =>
    apiClient.put<PostResponse, UpdatePostPayload>(`/posts/${id}`, payload);
  const queryClient = getQueryClient();
  const toastKey = 'post-update';

  return mutationOptions({
    mutationFn: (payload: UpdatePostPayload) =>
      updatePost(payload).then(({ data }) => data),
    onMutate: () => options.toast?.({ toastKey, mode: 'loading' }),
    onError: (e) =>
      options.toast?.({
        toastKey,
        mode: 'error',
        content: `Operation failed: ${e.message}`,
      }),
    onSuccess: (post) => {
      options.toast?.({ toastKey, mode: 'success', content: 'Post updated' });
      queryClient.setQueryData([postsKey, { id: post.id }], post);
      queryClient.invalidateQueries({ queryKey: [postsKey] });
      options.onSuccess?.(post);
    },
  });
};

export const postUpdatePublicationStatusMutationOptions = (
  id: string,
  options: {
    toast?: Toast;
    onSuccess?: (post: PostResponse) => void;
    onSettled?: () => void;
  } = {},
) => {
  const patchPostStatus = (payload: PostStatus) =>
    apiClient.patch<PostResponse>(`posts/${id}/${payload}`);
  const queryClient = getQueryClient();
  const toastKey = `post-${id}-status-update`;

  return mutationOptions({
    mutationFn: (payload: PostStatus) =>
      patchPostStatus(payload).then(({ data }) => data),
    onMutate: () => options.toast?.({ toastKey, mode: 'loading' }),
    onError: (e) =>
      options.toast?.({
        toastKey,
        mode: 'error',
        content: `Operation failed: ${e.message}`,
      }),
    onSuccess: (post, newStatus) => {
      options.toast?.({
        toastKey,
        mode: 'success',
        content: `The post has been ${newStatus.toLowerCase()}`,
      });
      queryClient.setQueryData([postsKey, { id }], post);
      queryClient.invalidateQueries({ queryKey: [postsKey] });
      options.onSuccess?.(post);
    },
    onSettled: options.onSettled,
  });
};
