import { PropsWithChildren } from 'react';

import DocsNavSidebar from '../../../components/sidebars/docsNavSidebar';

const DocsLayout = async ({ children }: Readonly<PropsWithChildren>) => (
  <>
    <DocsNavSidebar />
    <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
  </>
);

export default DocsLayout;
