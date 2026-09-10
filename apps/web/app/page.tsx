import Header from '../components/header';
import Hero from '../components/hero';
import { getUser } from '../lib/userContext';

const Home = async () => {
  const user = await getUser();
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header variant={user ? 'authenticated' : 'public'} user={user} />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center">
          <Hero isAuthenticated={!!user} />
        </div>
      </main>
    </div>
  );
};

export default Home;
