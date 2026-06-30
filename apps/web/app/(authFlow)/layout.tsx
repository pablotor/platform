import { PropsWithChildren } from 'react';
import Header from '../../components/header';

const AuthFlowLayout = async ({ children }: Readonly<PropsWithChildren>) => (
  <div className="flex h-screen flex-col overflow-hidden bg-background">
    <Header variant="authFlow" />
    <main className="flex-1 overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center py-8">
        {children}
      </div>
    </main>
  </div>
);

export default AuthFlowLayout;
