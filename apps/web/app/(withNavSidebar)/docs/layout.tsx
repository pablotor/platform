import { PropsWithChildren } from 'react';

import Header from '../../../components/header';
import DocsNavSidebar from '../../../components/sidebars/docsNavSidebar';

const DocsLayout = async ({ children }: Readonly<PropsWithChildren>) => (
  <>
    <Header variant="public" />
    <div className="flex flex-1 min-h-0">
      <DocsNavSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  </>
);

export default DocsLayout;
