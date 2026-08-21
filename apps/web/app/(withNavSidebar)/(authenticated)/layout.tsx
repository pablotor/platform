import { PropsWithChildren } from 'react';

import AuthenticatedNavSidebar from '../../../components/sidebars/authenticatedNavSidebar';

const AuthenticatedLayout = async ({
  children,
}: Readonly<PropsWithChildren>) => (
  <>
    <AuthenticatedNavSidebar />
    <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
  </>
);

export default AuthenticatedLayout;
