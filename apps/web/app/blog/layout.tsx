import { PropsWithChildren } from 'react';

import Footer from '../../components/footer';
import Header from '../../components/header';
import { getUser } from '../../lib/userContext';

const BlogLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const user = await getUser();
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header variant={user ? 'authenticated' : 'public'} user={user} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default BlogLayout;
