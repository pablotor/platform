import Hero from '../components/hero';
import Navbar from '../components/navbar';

const Home = async () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <Hero />
  </main>
);

export default Home;
