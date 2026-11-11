import { HomePage } from './pages/HomePage';
import { CareerPage } from './pages/CareerPage';

export function App() {
  const career = window.location.hash.startsWith('#/career');
  return career ? <CareerPage /> : <HomePage />;
}
