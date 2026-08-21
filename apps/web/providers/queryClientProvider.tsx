'use client';

import { QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

import getQueryClient from '../lib/queryClient';

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  );
};

export default QueryClientProvider;
