import Header from '../components/header';
import Hero from '../components/hero';

const Home = async () => (
  <div className="flex h-screen flex-col overflow-hidden bg-background">
    <Header variant="public" />
    <main className="flex-1 overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center">
        <Hero />
      </div>
    </main>
  </div>
);

export default Home;
