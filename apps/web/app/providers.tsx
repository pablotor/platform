import { ToastProvider } from '@repo/ui/toast/provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';

import QueryClientProvider from '../providers/queryClientProvider';

const Providers = ({ children }: PropsWithChildren) => (
  <NuqsAdapter>
    <ToastProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </ToastProvider>
  </NuqsAdapter>
);

export default Providers;
