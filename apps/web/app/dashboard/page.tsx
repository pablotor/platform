import Dashboard from '../../components/dashboard';
import Navbar from '../../components/navbar';

const Home = async () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <Dashboard />
  </main>
);

export default Home;
