import { PropsWithChildren } from 'react';

import Header from '../../../components/header';
import AuthenticatedNavSidebar from '../../../components/sidebars/authenticatedNavSidebar';
import { getUser } from '../../../lib/userContext';

const AuthenticatedLayout = async ({
  children,
}: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <>
      <Header variant="authenticated" user={user} />
      <div className="flex flex-1 min-h-0">
        <AuthenticatedNavSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default AuthenticatedLayout;
