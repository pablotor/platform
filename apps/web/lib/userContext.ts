import { headers } from 'next/headers';
import { cache } from 'react';

import authClient from './authClient';

export type UserContextData = Pick<
  (typeof authClient.$Infer.Session)['user'],
  'id' | 'email' | 'name' | 'image'
>;

const USER_ID_HEADER = 'x-user-id';
const USER_NAME_HEADER = 'x-user-name';
const USER_EMAIL_HEADER = 'x-user-email';
const USER_IMAGE_HEADER = 'x-user-image';

export const setUserHeaders = (
  requestHeaders: Headers,
  user: UserContextData,
) => {
  requestHeaders.set(USER_ID_HEADER, user.id);
  requestHeaders.set(USER_NAME_HEADER, encodeURIComponent(user.name));
  requestHeaders.set(USER_EMAIL_HEADER, user.email);
  if (user.image) {
    requestHeaders.set(USER_IMAGE_HEADER, encodeURIComponent(user.image));
  }
};

export const getUser = cache(async (): Promise<UserContextData | null> => {
  const headersList = await headers();
  const email = headersList.get(USER_EMAIL_HEADER);
  if (!email) return null;

  return {
    id: decodeURIComponent(headersList.get(USER_ID_HEADER) ?? ''),
    name: decodeURIComponent(headersList.get(USER_NAME_HEADER) ?? ''),
    email,
    image: decodeURIComponent(headersList.get(USER_IMAGE_HEADER) ?? ''),
  };
});
